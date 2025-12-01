# serializers.py
from rest_framework import serializers
from .models import SkillListing
from accounts.models import User
from listings.models import PortfolioImage

class PublicUserSerializer(serializers.ModelSerializer):
  class Meta:
    model = User
    fields = ["user_id", "username", "first_name", "last_name", "role", "location", "bio", "profile_picture_url"]


class PortfolioImageSerializer(serializers.ModelSerializer):
  class Meta:
    model = PortfolioImage
    fields = ["id", "image_url", "uploaded_at"]

class SkillListingSerializer(serializers.ModelSerializer):
  user = PublicUserSerializer(read_only=True)
  user_id = serializers.IntegerField(source="user.id", read_only=True)
  skill_offered_name = serializers.CharField(source="skill_offered.skill_name", read_only=True)
  skill_desired_name = serializers.CharField(source="skill_desired.skill_name", read_only=True)
  portfolio_images = PortfolioImageSerializer(many=True, read_only=True)

  class Meta:
    model = SkillListing
    fields = [
      "listing_id", "user_id", "user",
      "skill_offered", "skill_offered_name",
      "skill_desired", "skill_desired_name",
      "title", "description", "status",
      "creation_date", "last_updated", "location_preference", 
      "portfolio_link",
      "portfolio_images",
    ]
