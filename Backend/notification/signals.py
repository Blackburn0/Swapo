from django.db.models.signals import post_save
from django.dispatch import receiver
from message.models import Message
from trade.models import TradeProposal, Trade
from .models import Notification


@receiver(post_save, sender=Message)
def create_message_notification(sender, instance, created, **kwargs):
    """Create notification when a new message is sent"""
    if created:
        Notification.objects.create(
            user=instance.receiver,
            message=instance,
            type="new_message",
            message_text=f"New message from {instance.sender.username}",
            link_url=f"/app/dashboard/messages"
        )


@receiver(post_save, sender=TradeProposal)
def create_trade_proposal_notification(sender, instance, created, **kwargs):
    """Create notification when a new trade proposal is made"""
    if created:
        proposer_name = f"{instance.proposer.first_name} {instance.proposer.last_name}" if instance.proposer.first_name else instance.proposer.username
        Notification.objects.create(
            user=instance.recipient,
            proposal=instance,
            type="trade_proposal",
            message_text=f"{proposer_name} proposed a trade: {instance.skill_offered_by_proposer.skill_name} for {instance.skill_desired_by_proposer.skill_name}",
            link_url=f"/app/dashboard/proposal/{instance.proposal_id}"
        )
    elif not created and instance.status == "accepted":
        # Notify the proposer when their proposal is accepted
        recipient_name = (
            f"{instance.recipient.first_name} {instance.recipient.last_name}"
            if instance.recipient.first_name
            else instance.recipient.username
        ).title()

        Notification.objects.create(
            user=instance.proposer,
            proposal=instance,
            type="trade_accepted",
            message_text=f"{recipient_name} accepted your trade proposal!",
            link_url=f"/app/dashboard/proposal/{instance.proposal_id}"
        )

@receiver(post_save, sender=Trade)
def create_trade_notification(sender, instance, created, **kwargs):
    """Create notification when a trade is created"""
    if created and instance.proposal:
        # Notify both users that a trade has been created
        user1_name = f"{instance.user1.first_name} {instance.user1.last_name}" if instance.user1.first_name else instance.user1.username
        user2_name = f"{instance.user2.first_name} {instance.user2.last_name}" if instance.user2.first_name else instance.user2.username
        
        # Notify user2
        Notification.objects.create(
            user=instance.user2,
            trade=instance,
            type="trade_accepted",
            message_text=f"Trade started with {user1_name}: {instance.skill1.skill_name} ↔ {instance.skill2.skill_name}",
            link_url=f"/app/dashboard/trade/{instance.trade_id}"
        )
        
        # Notify user1
        Notification.objects.create(
            user=instance.user1,
            trade=instance,
            type="trade_accepted",
            message_text=f"Trade started with {user2_name}: {instance.skill1.skill_name} ↔ {instance.skill2.skill_name}",
            link_url=f"/app/dashboard/trade/{instance.trade_id}"
        )
