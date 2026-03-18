from django.db import models


class Widget(models.Model):
    widget_type = models.CharField(max_length=50)
    title = models.CharField(max_length=200)
    settings_json = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class DashboardLayout(models.Model):
    user_id = models.IntegerField()
    layout_json = models.JSONField()
    widgets_json = models.JSONField(default=list)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Dashboard {self.user_id}"