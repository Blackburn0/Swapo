from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import SkillListing
from skills.models import Skill
from .serializers import SkillListingSerializer
from django.shortcuts import get_object_or_404

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
    if listing_id:  # detail view
      listing = get_object_or_404(SkillListing, listing_id=listing_id)
      serializer = SkillListingSerializer(listing)
      return Response(serializer.data, status=status.HTTP_200_OK)
    
    # list view
    listings = SkillListing.objects.filter(status='active')
    serializer = SkillListingSerializer(listings, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

  def post(self, request):
    print("USER:", request.user)

    data = request.data.copy()  # make mutable copy

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
      serializer.save(user=request.user)
      return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    print("ERRORS:", serializer.errors)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

  def put(self, request, listing_id):
    listing = get_object_or_404(SkillListing, listing_id=listing_id, user=request.user)
    serializer = SkillListingSerializer(listing, data=request.data, partial=False)
    if serializer.is_valid():
      serializer.save()
      return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

  def patch(self, request, listing_id):
    listing = get_object_or_404(SkillListing, listing_id=listing_id, user=request.user)
    serializer = SkillListingSerializer(listing, data=request.data, partial=True)
    if serializer.is_valid():
      serializer.save()
      return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

  def delete(self, request, listing_id):
    listing = get_object_or_404(SkillListing, listing_id=listing_id, user=request.user)
    listing.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)
