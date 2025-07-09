from rest_framework import viewsets, permissions, filters
from .models import Customer
from .serializers import CustomerSerializer

class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'email', 'phone_number', 'address']
    ordering_fields = ['name', 'email']

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
