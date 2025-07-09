from rest_framework import routers
from app.products.views import ProductViewSet
from app.customers.views import CustomerViewSet

router = routers.DefaultRouter()
router.register(r'products', ProductViewSet)
router.register(r'customers', CustomerViewSet)