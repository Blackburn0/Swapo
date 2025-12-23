from django.db import models
from django.db import models
from django.utils import timezone
from accounts.models import User
from trade.models import Trade, TradeProposal
from message.models import Message 


class Notification(models.Model):
    NOTIFICATION_TYPES = [
        ("new_message", "New Message"),
        ("trade_proposal", "Trade Proposal"),
        ("trade_accepted", "Trade Accepted"),
        ("trade_active", "Active Trade"),
        ("trade_completed", "Trade Completed"),
        ("system_alert", "System Alert"),
    ]

    notification_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notifications")

    message = models.ForeignKey(Message, on_delete=models.SET_NULL, null=True, blank=True, related_name="notifications")
    proposal = models.ForeignKey(TradeProposal, on_delete=models.SET_NULL, null=True, blank=True, related_name="notifications")
    trade = models.ForeignKey(Trade, on_delete=models.SET_NULL, null=True, blank=True, related_name="notifications")

    type = models.CharField(max_length=50, choices=NOTIFICATION_TYPES)
    message_text = models.TextField()
    timestamp = models.DateTimeField(default=timezone.now)
    is_read = models.BooleanField(default=False)
    link_url = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return f"Notification {self.notification_id} for {self.user} - {self.type}"
