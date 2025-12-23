from django.urls import path
from .views import SkillListingView
from accounts.views import PortfolioImageDeleteView

urlpatterns = [
  path('', SkillListingView.as_view(), name='listings'),
  path('<int:listing_id>/', SkillListingView.as_view(), name='listing-detail'),
  path(
  "portfolio-images/<int:image_id>/",
  PortfolioImageDeleteView.as_view(),
  name="delete-portfolio-image"
),
]
