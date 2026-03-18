from django.db import models


class DashboardLayout(models.Model):
    user_id = models.IntegerField()
    layout_json = models.JSONField()
    widgets_json = models.JSONField(default=list)   # ✅ ADD THIS

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "dashboard_layout"