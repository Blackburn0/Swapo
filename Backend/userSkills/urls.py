from django.urls import path
from .views import AddUserSkillView, PublicUserSkillsView

urlpatterns = [
  path('add-skills/', AddUserSkillView.as_view(), name='add-user-skills'),
  path('<int:user_id>/', PublicUserSkillsView.as_view(), name='public-user-skills'),
]
