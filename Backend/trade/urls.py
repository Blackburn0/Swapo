from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TradeViewSet, TradeProposalViewSet

router = DefaultRouter()
router.register(r'proposals', TradeProposalViewSet, basename='tradeproposal')
router.register(r'', TradeViewSet, basename='trade')

urlpatterns = [
    path('', include(router.urls)),
]
