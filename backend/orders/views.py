from rest_framework import viewsets
from .models import CustomerOrder
from .serializers import CustomerOrderSerializer


class CustomerOrderViewSet(viewsets.ModelViewSet):

    queryset = CustomerOrder.objects.all().order_by("-created_at")
    serializer_class = CustomerOrderSerializer