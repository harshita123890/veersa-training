from rest_framework import routers
from app.products.views import ProductViewSet
from app.customers.views import CustomerViewSet
from app.orders.views import OrderViewSet

router = routers.DefaultRouter()
router.register(r'products', ProductViewSet)
router.register(r'customers', CustomerViewSet)
router.register(r'orders', OrderViewSet)

