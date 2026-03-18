from django.db import models


class CustomerOrder(models.Model):

    COUNTRY_CHOICES = [
        ("India", "India"),
        ("United States", "United States"),
        ("Canada", "Canada"),
        ("Australia", "Australia"),
        ("Singapore", "Singapore"),
        ("Hong Kong", "Hong Kong"),
    ]

    PRODUCT_CHOICES = [
        ("Fiber Internet 300 Mbps", "Fiber Internet 300 Mbps"),
        ("5GUnlimited Mobile Plan", "5GUnlimited Mobile Plan"),
        ("Fiber Internet 1 Gbps", "Fiber Internet 1 Gbps"),
        ("Business Internet 500 Mbps", "Business Internet 500 Mbps"),
        ("VoIP Corporate Package", "VoIP Corporate Package"),
    ]

    STATUS_CHOICES = [
        ("Pending", "Pending"),
        ("In progress", "In progress"),
        ("Completed", "Completed"),
    ]

    CREATED_BY_CHOICES = [
        ("Mr. Michael Harris", "Mr. Michael Harris"),
        ("Mr. Ryan Cooper", "Mr. Ryan Cooper"),
        ("Ms. Olivia Carter", "Ms. Olivia Carter"),
        ("Mr. Lucas Martin", "Mr. Lucas Martin"),
    ]

    # Customer Information
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email_id = models.EmailField(max_length=254)
    phone_number = models.CharField(max_length=50)
    street_address = models.CharField(max_length=200)
    city = models.CharField(max_length=100)
    state_province = models.CharField(max_length=100)
    postal_code = models.CharField(max_length=20)
    country = models.CharField(max_length=50, choices=COUNTRY_CHOICES)

    # Order Information
    product = models.CharField(max_length=200, choices=PRODUCT_CHOICES)
    quantity = models.PositiveIntegerField(default=1)
    unit_price = models.DecimalField(max_digits=12, decimal_places=2)
    total_amount = models.DecimalField(max_digits=12, decimal_places=2, editable=False)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default="Pending")
    created_by = models.CharField(max_length=100, choices=CREATED_BY_CHOICES)

    created_at = models.DateTimeField(auto_now_add=True)  # Order date

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

    def save(self, *args, **kwargs):
        qty = int(self.quantity or 0)
        if qty < 1:
            qty = 1
            self.quantity = 1
        self.total_amount = (self.unit_price or 0) * qty
        super().save(*args, **kwargs)