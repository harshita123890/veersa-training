from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework import serializers
from django.db import transaction

from .models import Order, OrderItem
from .serializers import OrderSerializer
from app.products.models import Product

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all().order_by('-created_at')
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self):
        return Order.objects.filter(created_by=self.request.user).order_by('-created_at')

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        validated_data = serializer.validated_data

        items_data = validated_data.pop('items')

        insufficient_stock = []
        for item in items_data:
            product = item['product']
            quantity = item['quantity']
            if product.stock_quantity < quantity:
                insufficient_stock.append(
                    f"{product.name} (Available: {product.stock_quantity}, Requested: {quantity})"
                )

        if insufficient_stock:
            error_message = "Insufficient stock for:\n" + "\n".join(insufficient_stock)
            raise serializers.ValidationError({"items": [error_message]})

        with transaction.atomic():
            order = Order.objects.create(created_by=request.user, **validated_data)

            for item in items_data:
                product = item['product']
                quantity = item['quantity']

                product.stock_quantity -= quantity
                product.save()

                OrderItem.objects.create(order=order, price=product.price, **item)

        return Response(self.get_serializer(order).data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        new_status = request.data.get("status", instance.status)
        current_status = instance.status

        if current_status == "delivered":
            raise serializers.ValidationError({"status": "Cannot change status of a delivered order."})

        valid_transitions = {
            "pending": ["processing", "cancelled"],
            "processing": ["shipped", "cancelled"],
            "shipped": ["delivered", "cancelled"],
            "delivered": [],
            "cancelled": []
        }

        if new_status not in valid_transitions[current_status]:
            raise serializers.ValidationError({
                "status": f"Invalid status transition from '{current_status}' to '{new_status}'"
            })

        instance.status = new_status
        instance.save()
        return Response(self.get_serializer(instance).data)
