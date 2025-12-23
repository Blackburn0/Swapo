from rest_framework import serializers
from .models import Trade, TradeProposal
from accounts.serializers import PublicUserSerializer
from skills.serializers import SkillSerializer


class TradeProposalSerializer(serializers.ModelSerializer):
    message = serializers.CharField(required=False, allow_blank=True)
    proposer_details = PublicUserSerializer(source='proposer', read_only=True)
    recipient_details = PublicUserSerializer(source='recipient', read_only=True)
    skill_offered_details = SkillSerializer(source='skill_offered_by_proposer', read_only=True)
    skill_desired_details = SkillSerializer(source='skill_desired_by_proposer', read_only=True)
    
    class Meta:
        model = TradeProposal
        fields = "__all__"
        read_only_fields = ["proposal_id", "proposal_date", "last_status_update"]


class TradeSerializer(serializers.ModelSerializer):
    user1_details = PublicUserSerializer(source='user1', read_only=True)
    user2_details = PublicUserSerializer(source='user2', read_only=True)
    skill1_details = SkillSerializer(source='skill1', read_only=True)
    skill2_details = SkillSerializer(source='skill2', read_only=True)
    proposal_details = TradeProposalSerializer(source='proposal', read_only=True)
    
    class Meta:
        model = Trade
        fields = "__all__"
        read_only_fields = ["trade_id", "start_date"]
