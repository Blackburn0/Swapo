from django.db import models
from django.utils import timezone
from accounts.models import User
from trade.models import Trade, TradeProposal


class Message(models.Model):
    MESSAGE_TYPES = [
        ("text", "Text"),
        ("attachment", "Attachment"),
    ]

    message_id = models.AutoField(primary_key=True)
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name="messages_sent")
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name="messages_received")

    trade = models.ForeignKey(
        Trade, on_delete=models.SET_NULL, null=True, blank=True, related_name="messages"
    )
    proposal = models.ForeignKey(
        TradeProposal, on_delete=models.SET_NULL, null=True, blank=True, related_name="messages"
    )

    content = models.TextField()
    timestamp = models.DateTimeField(default=timezone.now)
    is_read = models.BooleanField(default=False)
    message_type = models.CharField(max_length=20, choices=MESSAGE_TYPES, default="text")

    def __str__(self):
        return f"Message {self.message_id} from {self.sender} to {self.receiver}"
