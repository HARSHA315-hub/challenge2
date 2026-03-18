from rest_framework import serializers
from .models import DashboardLayout


class DashboardConfigSerializer(serializers.ModelSerializer):
    class Meta:
        model = DashboardLayout
        fields = "__all__"