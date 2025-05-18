from django.contrib.auth.models import User
from django.db import models

# Create your models here.
class Customer(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    date_of_birth = models.DateField(null=False)
    phone = models.CharField(max_length=15)

    def __str__(self):
        return f"{self.first_name, self.last_name}"
    
    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['first_name', 'last_name', 'phone'], name='unique_customer_identity')
        ]