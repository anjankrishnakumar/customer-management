from rest_framework import serializers
from .models import Customer
from datetime import datetime

class CustomerSerializer(serializers.ModelSerializer):
    user = serializers.CharField(source='user.username', read_only=True)

    date_of_birth = serializers.DateField(input_formats=['%d/%m/%Y', '%Y-%m-%d', '%d-%m-%Y'])

    class Meta:
        model = Customer
        fields = "__all__"
    
    def create(self, validated_data):
        user = self.context['request'].user
        return Customer.objects.create(user=user, **validated_data)


    # Field-level validation
    def validate_phone(self, value):
        if len(str(value)) < 10:
            raise serializers.ValidationError("Phone number must be at least 10 digits.")
        return value

    def validate_first_name(self, value):
        if not value.isalpha():
            raise serializers.ValidationError("First name should only contain letters.")
        return value

    def validate_last_name(self, value):
        if not value.isalpha():
            raise serializers.ValidationError("Last name should only contain letters.")
        return value

    # Object-level validation
    def validate(self, data):
        if data['first_name'].lower() == data['last_name'].lower():
            raise serializers.ValidationError("First name and last name cannot be the same.")
        if data['date_of_birth'] > datetime.now().date():
            raise serializers.ValidationError("Date of birth cannot be in the future.")
        return data