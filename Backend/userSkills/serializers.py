from rest_framework import serializers
from userSkills.models import UserSkill
from skills.models import Skill


class UserSkillSerializer(serializers.ModelSerializer):
  user_id = serializers.IntegerField(source='user.id', read_only=True)

  class Meta:
    model = UserSkill
    fields = ['user_skill_id', 'user_id', 'skill', 'skill_type', 'proficiency_level', 'details']


class AddUserSkillSerializer(serializers.Serializer):
  offerings = serializers.ListField(child=serializers.DictField(), required=False)
  desires = serializers.ListField(child=serializers.DictField(), required=False)

  def create(self, validated_data):
    """
    Create or update UserSkill instances for offerings and desires.
    Automatically creates a Skill if it doesn't exist.
    """
    user = self.context['request'].user
    created_skills = []

    def add_skills(skill_list, skill_type):
      for skill_data in skill_list:
        skill_name = skill_data.get('skill_name')
        
        # Skip if no skill name provided
        if not skill_name:
          continue
        
        category = skill_data.get('category', 'General')
        description = skill_data.get('description', '')

        # Get or create Skill by skill_name (not skill_id)
        skill_obj, _ = Skill.objects.get_or_create(
          skill_name=skill_name,
          defaults={
            'category': category,
            'description': description
          }
        )

        # Create or update UserSkill
        skill_instance, _ = UserSkill.objects.update_or_create(
          user=user,
          skill=skill_obj,
          skill_type=skill_type,
          defaults={
            'proficiency_level': skill_data.get('proficiency_level', ''),
            'details': skill_data.get('details', '')
          }
        )
        created_skills.append(skill_instance)

    # Add offerings and desires
    add_skills(validated_data.get('offerings', []), 'offering')
    add_skills(validated_data.get('desires', []), 'desiring')

    return created_skills

  def to_representation(self, instance):
      """
      Serialize the list of UserSkill model instances
      """
      return UserSkillSerializer(instance, many=True).data


"""
Example Request/Response

POST /user-skills/add-skills/ with:

{
  "offerings": [
    {"skill_name": "Photography", "proficiency_level": "Expert"},
    {"skill_name": "Graphic Design", "proficiency_level": "Beginner"}
  ],
  "desires": [
    {"skill_name": "Guitar", "details": "Want to learn guitar"}
  ]
}

Response:

{
  "message": "3 skills added successfully",
  "skills": [
    {
      "user_skill_id": 10,
      "user_id": 5,
      "skill": 1,
      "skill_type": "offering",
      "proficiency_level": "Expert",
      "details": ""
    },
    {
      "user_skill_id": 11,
      "user_id": 5,
      "skill": 2,
      "skill_type": "offering",
      "proficiency_level": "Beginner",
      "details": ""
    },
    {
      "user_skill_id": 12,
      "user_id": 5,
      "skill": 3,
      "skill_type": "desiring",
      "proficiency_level": null,
      "details": "Want to learn guitar"
    }
  ]
}
"""
