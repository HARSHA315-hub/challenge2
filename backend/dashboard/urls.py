from django.urls import path
from .views import DashboardConfigView

urlpatterns = [
    path("config/", DashboardConfigView.as_view(), name="dashboard-config"),
]