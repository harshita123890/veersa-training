# from rest_framework import viewsets, permissions, filters
# from .models import Product
# from .serializers import ProductSerializer
# from rest_framework.decorators import action
# from rest_framework.response import Response

# class ProductViewSet(viewsets.ModelViewSet):
#     queryset = Product.objects.all()
#     serializer_class = ProductSerializer
#     permission_classes = [permissions.IsAuthenticated]
#     filter_backends = [filters.SearchFilter, filters.OrderingFilter]
#     search_fields = ['name', 'sku', 'status']  # DRF SearchFilter uses icontains by default for smart/partial matching
#     ordering_fields = ['stock_quantity', 'status']

#     def perform_create(self, serializer):
#         serializer.save(created_by=self.request.user)

#     @action(detail=False, methods=['get'])
#     def low_stock(self, request):
#         low_stock_products = Product.objects.filter(stock_quantity__lte=5, status='active')
#         serializer = self.get_serializer(low_stock_products, many=True)
#         return Response(serializer.data)

#     @action(detail=False, methods=['get'])
#     def out_of_stock(self, request):
#         out_of_stock_products = Product.objects.filter(stock_quantity=0)
#         serializer = self.get_serializer(out_of_stock_products, many=True)
#         return Response(serializer.data)





from django.core.cache import cache
from rest_framework import viewsets, permissions, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Product
from .serializers import ProductSerializer

def update_product_cache():
    all_products = Product.objects.all()
    serializer = ProductSerializer(all_products, many=True)
    cache.set("all_products", serializer.data, timeout=None)


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'sku', 'status']
    ordering_fields = ['stock_quantity', 'status', 'price', 'name']
    ordering = ['id'] 

    def list(self, request):
        return super().list(request)

    def retrieve(self, request, pk=None):
        # ORM retrieve
        return super().retrieve(request, pk)

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
        update_product_cache()

    def perform_update(self, serializer):
        serializer.save()
        update_product_cache()

    def perform_destroy(self, instance):
        instance.delete()
        update_product_cache()

    @action(detail=False, methods=['get'])
    def low_stock(self, request):
        qs = Product.objects.filter(stock_quantity__lte=5, status='active')
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def out_of_stock(self, request):
        qs = Product.objects.filter(stock_quantity=0)
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)
