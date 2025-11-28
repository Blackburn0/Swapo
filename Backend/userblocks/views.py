from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import UserBlock
from .serializers import UserBlockSerializer


class UserBlockViewSet(viewsets.ModelViewSet):
  queryset = UserBlock.objects.all()
  serializer_class = UserBlockSerializer
  permission_classes = [permissions.IsAuthenticated]

  def get_queryset(self):
    queryset = UserBlock.objects.filter(blocker=self.request.user)
    blocked_id = self.request.query_params.get('blocked')
    if blocked_id:
      queryset = queryset.filter(blocked_id=blocked_id)
    return queryset


  def perform_create(self, serializer):
    blocker = self.request.user
    blocked = serializer.validated_data['blocked']

    # Check if the block already exists
    block_exists = UserBlock.objects.filter(blocker=blocker, blocked=blocked).exists()
    if block_exists:
      return

    # Automatically set the blocker to the current user
    serializer.save(blocker=self.request.user)

  # check whether a user is blocked or not (for the frontend to disable interactions)
  @action(detail=False, methods=['get'], url_path='is-blocked/(?P<user_id>[^/.]+)')
  def is_blocked(self, request, user_id=None):
    is_blocked = UserBlock.objects.filter(
      blocker=request.user, blocked_id=user_id
    ).exists()
    return Response({'is_blocked': is_blocked})
  """
    GET /api/userblocks/blocks/is-blocked/5/
    Returns: { "is_blocked": true }
  """

