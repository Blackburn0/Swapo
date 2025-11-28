from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserBlockViewSet

router = DefaultRouter()
router.register(r'', UserBlockViewSet, basename='userblock')

urlpatterns = [
  path('', include(router.urls)),
]

"""
  Available Endpoints
  GET	/api/v1/userblocks/	List all users that you have blocked
  POST	/api/v1/userblocks/	Block another user
  GET	/api/v1/userblocks/<id>/	Get details of one specific block
  DELETE	/api/v1/userblocks/<id>/ Unblock a user (delete that block record)
"""