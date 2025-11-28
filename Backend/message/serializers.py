from rest_framework import serializers
from .models import Message
from accounts.models import User


class UserBasicSerializer(serializers.ModelSerializer):
    """Minimal user info for message display"""
    class Meta:
        model = User
        fields = ["user_id", "username", "first_name", "last_name", "profile_picture_url"]


class MessageSerializer(serializers.ModelSerializer):
    sender_details = UserBasicSerializer(source="sender", read_only=True)
    receiver_details = UserBasicSerializer(source="receiver", read_only=True)
    
    class Meta:
        model = Message
        fields = [
            "message_id",
            "sender",
            "receiver",
            "sender_details",
            "receiver_details",
            "content",
            "timestamp",
            "is_read",
            "message_type",
            "trade",
            "proposal",
        ]
        read_only_fields = ["message_id", "timestamp", "sender", "sender_details", "receiver_details"]


class ConversationSerializer(serializers.Serializer):
    """Serializer for conversation list/summary"""
    other_user = UserBasicSerializer()
    last_message = MessageSerializer()
    unread_count = serializers.IntegerField()
