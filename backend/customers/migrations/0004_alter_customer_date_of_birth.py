# Generated by Django 5.2.1 on 2025-05-12 17:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('customers', '0003_rename_data_of_birth_customer_date_of_birth'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customer',
            name='date_of_birth',
            field=models.DateField(),
        ),
    ]
