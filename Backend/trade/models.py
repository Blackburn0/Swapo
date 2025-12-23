from django.db import models
from django.utils import timezone
from accounts.models import User
from skills.models import Skill
from listings.models import SkillListing


class TradeProposal(models.Model):
    PROPOSAL_STATUS_CHOICES = [
        ("pending", "Pending"),
        ("accepted", "Accepted"),
        ("rejected", "Rejected"),
        ("withdrawn", "Withdrawn"),
        ("countered", "Countered"),
    ]

    proposal_id = models.AutoField(primary_key=True)
    listing = models.ForeignKey(SkillListing, on_delete=models.CASCADE, related_name="proposals")
    proposer = models.ForeignKey(User, on_delete=models.CASCADE, related_name="proposals_made")
    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name="proposals_received")
    skill_offered_by_proposer = models.ForeignKey(Skill, on_delete=models.CASCADE, related_name="proposals_offered")
    skill_desired_by_proposer = models.ForeignKey(Skill, on_delete=models.CASCADE, related_name="proposals_desired")
    message = models.TextField()
    proposal_date = models.DateTimeField(default=timezone.now)
    status = models.CharField(max_length=20, choices=PROPOSAL_STATUS_CHOICES, default="pending")
    last_status_update = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Proposal {self.proposal_id} by {self.proposer} to {self.recipient}"


class Trade(models.Model):
    TRADE_STATUS_CHOICES = [
        ("active", "Active"),
        ("in_progress", "In Progress"),
        ("completed", "Completed"),
        ("disputed", "Disputed"),
        ("cancelled", "Cancelled"),
    ]

    trade_id = models.AutoField(primary_key=True)
    proposal = models.OneToOneField(
        TradeProposal, on_delete=models.SET_NULL, null=True, blank=True, related_name="trade"
    )
    user1 = models.ForeignKey(User, on_delete=models.CASCADE, related_name="trades_as_user1")
    user2 = models.ForeignKey(User, on_delete=models.CASCADE, related_name="trades_as_user2")
    skill1 = models.ForeignKey(Skill, on_delete=models.CASCADE, related_name="trades_as_skill1")
    skill2 = models.ForeignKey(Skill, on_delete=models.CASCADE, related_name="trades_as_skill2")

    start_date = models.DateTimeField(default=timezone.now)
    expected_completion_date = models.DateField(blank=True, null=True)
    actual_completion_date = models.DateTimeField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=TRADE_STATUS_CHOICES, default="active")
    terms_agreed = models.TextField()

    def __str__(self):
        return f"Trade {self.trade_id}: {self.user1} ↔ {self.user2}"
