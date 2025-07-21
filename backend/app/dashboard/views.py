from django.db.models import Sum, Count
from django.db.models.functions import TruncMonth
from django.utils.timezone import now
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from app.orders.models import Order, OrderItem
from app.products.models import Product
import calendar

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_metrics(request):
    today = now()

    current_month_orders = Order.objects.filter(
        created_at__year=today.year,
        created_at__month=today.month,
        status__in=["processing", "shipped", "delivered"]
    )

    total_orders = current_month_orders.count()
    total_revenue = current_month_orders.aggregate(
        total=Sum('items__price')
    )['total'] or 0

    top_products = (
        OrderItem.objects
        .values('product__id', 'product__name')
        .annotate(sold_count=Count('id'))
        .order_by('-sold_count')[:5]
    )

    low_stock_products = Product.objects.filter(stock_quantity__lte=5, status='active')

    monthly_revenue_raw = (
        Order.objects
        .filter(
            created_at__year=today.year,
            status__in=["processing", "shipped", "delivered"]
        )
        .annotate(month=TruncMonth('created_at'))
        .values('month')
        .annotate(revenue=Sum('items__price'))
        .order_by('month')
    )

    monthly_revenue = [
        {
            "month": calendar.month_abbr[item['month'].month],
            "revenue": item['revenue'] or 0
        }
        for item in monthly_revenue_raw
    ]

    return Response({
        "total_orders": total_orders,
        "total_revenue": total_revenue,
        "top_products": top_products,
        "low_stock": [
            {"id": p.id, "name": p.name, "stock_quantity": p.stock_quantity}
            for p in low_stock_products
        ],
        "monthly_revenue": monthly_revenue
    })
