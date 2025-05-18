from django.urls import path
from .views import CustomListCreate

urlpatterns = [
    path('customers/', CustomListCreate.as_view(), name='customers'),

]