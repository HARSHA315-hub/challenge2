from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from .models import DashboardLayout
from .serializers import DashboardConfigSerializer


class DashboardConfigView(APIView):
    def get(self, request):
        cfg = DashboardLayout.objects.order_by("-updated_at").first()

        if not cfg:
            return Response(
                {"id": None, "layout_json": {}, "widgets_json": []},
                status=status.HTTP_200_OK,
            )

        return Response(DashboardConfigSerializer(cfg).data)

    def put(self, request):
        cfg = DashboardLayout.objects.order_by("-updated_at").first()

        if not cfg:
            serializer = DashboardConfigSerializer(data=request.data)
        else:
            serializer = DashboardConfigSerializer(
                cfg, data=request.data, partial=True
            )

        serializer.is_valid(raise_exception=True)
        saved = serializer.save()

        return Response(DashboardConfigSerializer(saved).data)