from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.shortcuts import get_object_or_404
from .models import SkillListing
from skills.models import Skill
from listings.models import PortfolioImage
from .serializers import SkillListingSerializer

class SkillListingView(APIView):
  """
    GET: public, returns active listings
    POST: authenticated, create a listing
    PUT/PATCH: authenticated, update own listing
    DELETE: authenticated, delete own listing
  """
  def get_permissions(self):
      if self.request.method == 'GET':
          return [AllowAny()]
      return [IsAuthenticated()]

  def get(self, request, listing_id=None):
      if listing_id:
          listing = get_object_or_404(SkillListing, listing_id=listing_id)
          serializer = SkillListingSerializer(listing)
          return Response(serializer.data, status=status.HTTP_200_OK)

      listings = SkillListing.objects.filter(status='active')
      serializer = SkillListingSerializer(listings, many=True)
      return Response(serializer.data, status=status.HTTP_200_OK)

  def post(self, request):
      # Extract form fields (non-file data)
      data = request.data.dict()
      images = request.FILES.getlist("portfolio_images")

      # Handle custom offered skill
      if data.get("skill_offered") == "other" and data.get("custom_offer_skill"):
          skill_name = data.pop("custom_offer_skill").strip()
          skill, _ = Skill.objects.get_or_create(skill_name=skill_name)
          data["skill_offered"] = skill.pk

      # Handle custom desired skill
      if data.get("skill_desired") == "other" and data.get("custom_desired_skill"):
          skill_name = data.pop("custom_desired_skill").strip()
          skill, _ = Skill.objects.get_or_create(skill_name=skill_name)
          data["skill_desired"] = skill.pk

      serializer = SkillListingSerializer(data=data)
      if serializer.is_valid():
          listing = serializer.save(user=request.user)

          # Limit to 6 images
          if len(images) > 6:
              return Response({"error": "Maximum 6 portfolio images allowed."},
                              status=status.HTTP_400_BAD_REQUEST)

          for img in images:
              PortfolioImage.objects.create(listing=listing, image_url=img)

          return Response(SkillListingSerializer(listing).data, status=status.HTTP_201_CREATED)

      return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

  def put(self, request, listing_id):
      listing = get_object_or_404(SkillListing, listing_id=listing_id, user=request.user)
      serializer = SkillListingSerializer(listing, data=request.data)
      if serializer.is_valid():
          serializer.save()
          return Response(serializer.data)
      return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

  def patch(self, request, listing_id):
      listing = get_object_or_404(SkillListing, listing_id=listing_id, user=request.user)
      images = request.FILES.getlist("portfolio_images")
      serializer = SkillListingSerializer(listing, data=request.data, partial=True)
      if serializer.is_valid():
          serializer.save()
          if images:
              if listing.portfolio_images.count() + len(images) > 5:
                  return Response({"error": "Only 5 images allowed"}, status=400)
              for img in images:
                  PortfolioImage.objects.create(listing=listing, image_url=img)
          return Response(SkillListingSerializer(listing).data)
      return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

  def delete(self, request, listing_id):
      listing = get_object_or_404(SkillListing, listing_id=listing_id, user=request.user)
      listing.delete()
      return Response(status=status.HTTP_204_NO_CONTENT)
