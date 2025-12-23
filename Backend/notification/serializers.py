from rest_framework import serializers
from .models import Notification


class NotificationSerializer(serializers.ModelSerializer):
    sender_details = serializers.SerializerMethodField()
    message_details = serializers.SerializerMethodField()
    proposal_details = serializers.SerializerMethodField()
    trade_details = serializers.SerializerMethodField()

    class Meta:
        model = Notification
        fields = "__all__"
        read_only_fields = ["notification_id", "timestamp"]

    def get_sender_details(self, obj):
        # Get sender from message if it's a message notification
        if obj.message and obj.message.sender:
            return {
                "user_id": obj.message.sender.user_id,
                "username": obj.message.sender.username,
                "first_name": obj.message.sender.first_name,
                "last_name": obj.message.sender.last_name,
                "profile_picture_url": obj.message.sender.profile_picture_url,
            }
        # Get proposer from trade proposal if it's a trade notification
        elif obj.proposal and obj.proposal.proposer:
            return {
                "user_id": obj.proposal.proposer.user_id,
                "username": obj.proposal.proposer.username,
                "first_name": obj.proposal.proposer.first_name,
                "last_name": obj.proposal.proposer.last_name,
                "profile_picture_url": obj.proposal.proposer.profile_picture_url,
            }
        return None

    def get_message_details(self, obj):
        if obj.message:
            return {
                "message_id": obj.message.message_id,
                "content": obj.message.content,
                "timestamp": obj.message.timestamp,
            }
        return None

    def get_proposal_details(self, obj):
        if obj.proposal:
            return {
                "proposal_id": obj.proposal.proposal_id,
                "status": obj.proposal.status,
            }
        return None

    def get_trade_details(self, obj):
        if obj.trade:
            return {
                "trade_id": obj.trade.trade_id,
                "status": obj.trade.status,
            }
        return None
