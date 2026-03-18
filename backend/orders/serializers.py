from rest_framework import serializers
from .models import CustomerOrder


class CustomerOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomerOrder
        fields = "__all__"

    def validate(self, attrs):
        required_fields = [
            "first_name",
            "last_name",
            "email_id",
            "phone_number",
            "street_address",
            "city",
            "state_province",
            "postal_code",
            "country",
            "product",
            "quantity",
            "unit_price",
            "status",
            "created_by",
        ]
        for f in required_fields:
            if f not in attrs and self.instance is None:
                raise serializers.ValidationError({f: "Please fill the field"})
            if f in attrs and (attrs[f] is None or (isinstance(attrs[f], str) and not attrs[f].strip())):
                raise serializers.ValidationError({f: "Please fill the field"})

        qty = attrs.get("quantity")
        if qty is not None and qty < 1:
            raise serializers.ValidationError({"quantity": "Quantity cannot be less than 1"})

        return attrs