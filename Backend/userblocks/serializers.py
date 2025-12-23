from rest_framework import serializers
from .models import UserBlock
from accounts.models import User


class UserBlockSerializer(serializers.ModelSerializer):
  blocked_user_id = serializers.IntegerField(source='blocked.user_id', read_only=True)
  blocked_username = serializers.CharField(source='blocked.username', read_only=True)
  blocked_first_name = serializers.CharField(source='blocked.first_name', read_only=True)
  blocked_last_name = serializers.CharField(source='blocked.last_name', read_only=True)
  blocked_email = serializers.CharField(source='blocked.email', read_only=True)

  class Meta:
    model = UserBlock
    fields = [ 
      'block_id', 'block_date', 'blocker', 
      'blocked', 'blocked_user_id', 'blocked_username',
      'blocked_first_name', 'blocked_last_name', 'blocked_email'
    ]
    read_only_fields = ['block_id', 'block_date', 'blocker']
