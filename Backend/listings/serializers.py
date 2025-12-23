# serializers.py
from rest_framework import serializers
from cloudinary.uploader import upload as cloudinary_upload
from .models import SkillListing
from accounts.models import User
from listings.models import PortfolioImage


class PublicUserSerializer(serializers.ModelSerializer):
  class Meta:
    model = User
    fields = ["user_id", "username", "first_name", "last_name", "role", "location", "bio", "profile_picture_url"]


class PortfolioImageSerializer(serializers.ModelSerializer):
  image_file = serializers.ImageField(write_only=True, required=True)  

  class Meta:
    model = PortfolioImage
    fields = ["id", "image_url", "image_file", "uploaded_at"]

  def create(self, validated_data):
    image_file = validated_data.pop("image_file")
    upload_result = cloudinary_upload(image_file)
    validated_data["image_url"] = upload_result.get("secure_url")
    return PortfolioImage.objects.create(**validated_data)


class SkillListingSerializer(serializers.ModelSerializer):
  user = PublicUserSerializer(read_only=True)
  user_id = serializers.IntegerField(source="user.id", read_only=True)
  skill_offered_name = serializers.CharField(source="skill_offered.skill_name", read_only=True)
  skill_desired_name = serializers.CharField(source="skill_desired.skill_name", read_only=True)
  portfolio_images = PortfolioImageSerializer(many=True, read_only=True, required=False)

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

  def create(self, validated_data):
    images_data = validated_data.pop("portfolio_images", [])
    listing = SkillListing.objects.create(**validated_data)

    for img_data in images_data:
      PortfolioImageSerializer().create({**img_data, 'listing': listing})

    return listing

class UserPortfolioImageSerializer(serializers.ModelSerializer):
  class Meta:
    model = PortfolioImage
    fields = ["id", "listing", "image_url", "uploaded_at"]