from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.shortcuts import get_object_or_404
from cloudinary.uploader import upload as cloudinary_upload

from .models import SkillListing
from skills.models import Skill
from listings.models import PortfolioImage
from .serializers import SkillListingSerializer


class SkillListingView(APIView):
    """
    GET: public, returns active listings
    POST: authenticated, create a listing or upload user portfolio images
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

        listings = SkillListing.objects.filter(status='active').order_by('-creation_date')
        serializer = SkillListingSerializer(listings, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        """
        Handles:
        1. Creating a new listing with optional portfolio images
        2. Uploading user-wide portfolio images if `listing_id` not provided
        """
        images = request.FILES.getlist("portfolio_images")
        listing_id = request.data.get("listing_id")  # optional, for user-wide uploads

        # Case 1: Listing-specific creation
        if not listing_id:
            data = request.data.dict()

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
                    upload_result = cloudinary_upload(img)
                    PortfolioImage.objects.create(
                        listing=listing,
                        user=request.user,
                        image_url=upload_result.get("secure_url")
                    )

                return Response(SkillListingSerializer(listing).data, status=status.HTTP_201_CREATED)

            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # Case 2: User-wide portfolio upload
        else:
            if len(images) == 0:
                return Response({"error": "No images provided"}, status=status.HTTP_400_BAD_REQUEST)

            # Optional: Limit total user portfolio images to 6
            if PortfolioImage.objects.filter(user=request.user, listing__isnull=True).count() + len(images) > 6:
                return Response({"error": "Maximum 6 user portfolio images allowed."}, status=400)

            uploaded_urls = []
            for img in images:
                upload_result = cloudinary_upload(img)
                pi = PortfolioImage.objects.create(
                    user=request.user,
                    listing=None,  # not tied to any listing
                    image_url=upload_result.get("secure_url")
                )
                uploaded_urls.append(pi.image_url)

            return Response({"uploaded_images": uploaded_urls}, status=status.HTTP_201_CREATED)

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
                    upload_result = cloudinary_upload(img)
                    PortfolioImage.objects.create(
                        listing=listing,
                        user=request.user,
                        image_url=upload_result.get("secure_url")
                    )
            return Response(SkillListingSerializer(listing).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, listing_id):
        listing = get_object_or_404(SkillListing, listing_id=listing_id, user=request.user)
        listing.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
