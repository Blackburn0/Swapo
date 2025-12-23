from django.urls import path
from .views import SkillListingView

urlpatterns = [
  path('', SkillListingView.as_view(), name='listings'),
  path('<int:listing_id>/', SkillListingView.as_view(), name='listing-detail')
]
