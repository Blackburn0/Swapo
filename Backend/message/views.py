from rest_framework import viewsets, permissions, decorators, response, status
from django.db.models import Q, Max, Count, Case, When, IntegerField
from .models import Message
from .serializers import MessageSerializer, ConversationSerializer
from accounts.models import User


class MessageViewSet(viewsets.ModelViewSet):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        # All messages sent OR received by the user
        return Message.objects.filter(Q(sender=user) | Q(receiver=user)).order_by("timestamp")

    def perform_create(self, serializer):
        serializer.save(sender=self.request.user)

    @decorators.action(detail=False, methods=["get"], url_path="conversation/(?P<user_id>[^/.]+)")
    def get_conversation(self, request, user_id=None):
        """
        Custom endpoint:
        GET /api/v1/messages/conversation/<user_id>/
        Returns all messages between the logged-in user and the given user.
        Marks messages as read.
        """
        current_user = request.user

        # Fix: Use proper field lookups for User model with user_id as primary key
        messages = Message.objects.filter(
            Q(sender=current_user, receiver__user_id=user_id)
            | Q(sender__user_id=user_id, receiver=current_user)
        ).order_by("timestamp")

        # Mark unread messages as read
        messages.filter(receiver=current_user, is_read=False).update(is_read=True)

        serializer = self.get_serializer(messages, many=True)
        return response.Response(serializer.data, status=status.HTTP_200_OK)

    @decorators.action(detail=False, methods=["get"], url_path="conversations")
    def get_conversations(self, request):
        """
        Custom endpoint:
        GET /api/v1/messages/conversations/
        Returns a list of all conversations (chat summaries) for the current user.
        Each conversation includes: other user details, last message, unread count.
        """
        current_user = request.user

        # Get all users the current user has conversed with
        user_messages = Message.objects.filter(Q(sender=current_user) | Q(receiver=current_user))
        
        # Get unique user IDs (excluding current user)
        other_user_ids = set()
        for msg in user_messages:
            if msg.sender.user_id != current_user.user_id:
                other_user_ids.add(msg.sender.user_id)
            if msg.receiver.user_id != current_user.user_id:
                other_user_ids.add(msg.receiver.user_id)

        conversations = []
        for other_user_id in other_user_ids:
            try:
                other_user = User.objects.get(user_id=other_user_id)
                
                # Get conversation messages
                conversation_messages = Message.objects.filter(
                    Q(sender=current_user, receiver=other_user)
                    | Q(sender=other_user, receiver=current_user)
                ).order_by("-timestamp")

                if conversation_messages.exists():
                    last_message = conversation_messages.first()
                    
                    # Count unread messages from the other user
                    unread_count = conversation_messages.filter(
                        sender=other_user,
                        receiver=current_user,
                        is_read=False
                    ).count()

                    conversations.append({
                        "other_user": other_user,
                        "last_message": last_message,
                        "unread_count": unread_count,
                    })
            except User.DoesNotExist:
                continue

        # Sort by last message timestamp
        conversations.sort(key=lambda x: x["last_message"].timestamp, reverse=True)

        serializer = ConversationSerializer(conversations, many=True)
        return response.Response(serializer.data, status=status.HTTP_200_OK)
