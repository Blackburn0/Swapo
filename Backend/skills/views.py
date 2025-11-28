from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import Skill
from .serializers import SkillSerializer
from .permissions import IsAuthenticatedOrReadOnly

class SkillViewSet(viewsets.ModelViewSet):
  queryset = Skill.objects.all()
  serializer_class = SkillSerializer
  permission_classes = [IsAuthenticatedOrReadOnly]

  def create(self, request, *args, **kwargs):
    is_many = isinstance(request.data, list)  # Check if a list is sent
    data_to_create = []

    if is_many:
        for item in request.data:
          skill_name = item.get("skill_name").strip()
          if skill_name.lower() == "other":
            # Ignore placeholder "Other"
            continue
          # Create if it does not exist
          if not Skill.objects.filter(skill_name__iexact=skill_name).exists():
            data_to_create.append(item)
    else:
        skill_name = request.data.get("skill_name")
        if not Skill.objects.filter(skill_name__iexact=skill_name).exists():
          data_to_create.append(request.data)

    if not data_to_create:
        return Response(
          {"detail": "All skills already exist, nothing created."},
          status=status.HTTP_200_OK
        )

    serializer = self.get_serializer(data=data_to_create, many=True)
    serializer.is_valid(raise_exception=True)
    self.perform_create(serializer)
    headers = self.get_success_headers(serializer.data)
    return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


# Permission:
# Public Read
# Public can't write