from rest_framework import status
from rest_framework import serializers
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model
from .models import UserSkill
from .serializers import UserSkillSerializer, AddUserSkillSerializer

User = get_user_model()


class PublicUserSkillsView(APIView):
  """
  Public endpoint: anyone can fetch a user's skills by user_id.
  """
  permission_classes = []  # No authentication required

  def get(self, request, user_id):
    try:
      user = User.objects.get(user_id=user_id)
    except User.DoesNotExist:
      return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    skills = UserSkill.objects.filter(user=user)
    offerings = skills.filter(skill_type='offering')
    desires = skills.filter(skill_type='desiring')

    return Response({
      "user_id": user.user_id,
      "offerings": UserSkillSerializer(offerings, many=True).data,
      "desires": UserSkillSerializer(desires, many=True).data
    })
    

class UserSkillSerializer(serializers.ModelSerializer):
  user_id = serializers.IntegerField(source='user.user_id', read_only=True)
  skill_name = serializers.CharField(source='skill.skill_name', read_only=True)

  class Meta:
    model = UserSkill
    fields = ['user_skill_id', 'user_id', 'skill', 'skill_name', 'skill_type', 'proficiency_level', 'details']



class AddUserSkillView(APIView):
  permission_classes = [IsAuthenticated]

  def post(self, request):
    serializer = AddUserSkillSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
      skills = serializer.save()  # list of UserSkill objects
      return Response({
        "message": f"{len(skills)} skills added successfully",
        "skills": UserSkillSerializer(skills, many=True).data
      }, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


"""
Example GET request
GET /user-skills/?user_id=5
Authorization: Bearer <token>


Response:

{
  "user_id": 5,
  "offerings": [
    {
      "user_skill_id": 10,
      "user_id": 5,
      "skill": 1,
      "skill_type": "offering",
      "proficiency_level": "Expert",
      "details": "I can teach coding."
    }
  ],
  "desires": [
    {
      "user_skill_id": 12,
      "user_id": 5,
      "skill": 3,
      "skill_type": "desiring",
      "proficiency_level": null,
      "details": "Want to learn guitar."
    }
  ]
}
"""
