from rest_framework import serializers
from .models import Dashboard


class DashboardConfigSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dashboard
        fields = "__all__"