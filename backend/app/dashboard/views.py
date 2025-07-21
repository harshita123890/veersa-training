from django.db.models import Sum, Count
from django.db.models.functions import TruncMonth
from django.utils.timezone import now
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from app.orders.models import Order, OrderItem
from app.products.models import Product
import calendar
from app.customers.models import Customer  

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_metrics(request):
    user = request.user
    today = now()

    # Filter only orders created by the current admin
    current_month_orders = Order.objects.filter(
        created_by=user,
        created_at__year=today.year,
        created_at__month=today.month,
        status__in=["processing", "shipped", "delivered"]
    )

    total_orders = current_month_orders.count()
    total_revenue = current_month_orders.aggregate(
        total=Sum('items__price')
    )['total'] or 0

    # Top products from order items of this admin
    top_products = (
        OrderItem.objects
        .filter(order__created_by=user)
        .values('product__id', 'product__name')
        .annotate(sold_quantity=Sum('quantity'))
        .order_by('-sold_quantity')[:5]
    )

    # Low stock products for this admin
    low_stock_products = Product.objects.filter(
        created_by=user,
        stock_quantity__lte=5,
        status='active'
    )

    # Monthly revenue for this admin
    monthly_revenue_raw = (
        Order.objects
        .filter(
            created_by=user,
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
    total_active_products = Product.objects.filter(created_by=user, status='active').count()

    total_customers = Customer.objects.filter(created_by=user).count()

    return Response({
        "total_orders": total_orders,
        "total_revenue": total_revenue,
        "top_products": top_products,
        "low_stock": [
            {"id": p.id, "name": p.name, "stock_quantity": p.stock_quantity}
            for p in low_stock_products
        ],
        "monthly_revenue": monthly_revenue,
        "total_active_products": total_active_products,
        "total_customers": total_customers
    })
