from rest_framework import serializers
from .models import UserBlock


class UserBlockSerializer(serializers.ModelSerializer):
  class Meta:
    model = UserBlock
    fields = '__all__'
    read_only_fields = ['block_id', 'block_date', 'blocker']
