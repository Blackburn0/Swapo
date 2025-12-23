from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SkillViewSet

router = DefaultRouter()
router.register(r'', SkillViewSet)

# urlpatterns = router.urls

urlpatterns = [
    path('', include(router.urls)),
]

#  Endpoints 👇:

#  GET /api/v1/skills/ → List all skills
# POST /api/v1/skills/ → Create a new skill
# GET /api/v1/skills/{id}/ → Retrieve a skill
# PUT /api/v1/skills/{id}/ → Update a skill
# DELETE /api/v1/skills/{id}/ → Delete a skill