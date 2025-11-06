from rest_framework import generics, status
from django.core.exceptions import ObjectDoesNotExist
from django.shortcuts import redirect
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.db import IntegrityError, DatabaseError
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.core.mail import send_mail
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .models import User
from .serializers import RegisterSerializer, LoginSerializer, ChangePasswordSerializer




from django.contrib.auth.models import update_last_login









# accounts/views.py
from django.shortcuts import redirect
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from urllib.parse import urlencode
import logging

logger = logging.getLogger(__name__)


def get_tokens_for_user(user):
    """Generate JWT tokens for a user"""
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }


# @csrf_exempt
# def oauth_redirect_handler(request):
#     """
#     This view is called after successful OAuth authentication.
#     It generates JWT tokens and redirects to the frontend with tokens in URL.
#     """
#     logger.info("=== OAuth Redirect Handler Called ===")
#     logger.info(f"User authenticated: {request.user.is_authenticated}")
#     logger.info(f"User: {request.user}")
    
#     if not request.user.is_authenticated:
#         logger.error("User not authenticated in redirect handler")
#         # Redirect to login page
#         return redirect(f"{settings.FRONTEND_URL}/login?error=auth_failed")
    
#     try:
#         user = request.user
        
#         # Generate JWT tokens
#         tokens = get_tokens_for_user(user)
        
#         # Check if user needs onboarding
#         is_new_user = not getattr(user, 'is_profile_complete', True)
        
#         # Choose redirect URL based on user status
#         if is_new_user:
#             base_url = f"{settings.FRONTEND_URL}/onboarding"
#         else:
#             base_url = f"{settings.FRONTEND_URL}/dashboard"
        
#         # Prepare user data to pass
#         user_data = {
#             'access': tokens['access'],
#             'refresh': tokens['refresh'],
#             'user_id': str(getattr(user, 'user_id', user.id)),
#             'email': user.email,
#             'username': user.username,
#         }
        
#         # Build redirect URL with tokens
#         redirect_url = f"{base_url}?{urlencode(user_data)}"
        
#         logger.info(f"Redirecting to: {base_url} with tokens")
#         logger.info(f"Token generated successfully for user: {user.email}")
        
#         return redirect(redirect_url)
        
#     except Exception as e:
#         logger.error(f"Error in oauth_redirect_handler: {str(e)}", exc_info=True)
#         return redirect(f"{settings.FRONTEND_URL}/login?error=server_error")


# @csrf_exempt
# def oauth_redirect_handler(request):
#     logger.info("=== OAuth Redirect Handler Called ===")

#     if not request.user.is_authenticated:
#         return redirect(f"{settings.FRONTEND_URL}/login?error=auth_failed")

#     try:
#         user = request.user
#         tokens = get_tokens_for_user(user)

#         logger.info(f"Before update: user.last_login = {user.last_login}")

#         # Use last_login logic
#         is_new_user = user.last_login is None

#         from django.contrib.auth.models import update_last_login
#         update_last_login(None, user)
#         logger.info(f"After update: user.last_login = {user.last_login}")

#         # redirect logic
#         base_url = (
#             f"{settings.FRONTEND_URL}/onboarding"
#             if is_new_user
#             else f"{settings.FRONTEND_URL}/dashboard"
#         )

#         user_data = {
#             'access': tokens['access'],
#             'refresh': tokens['refresh'],
#             'user_id': str(user.user_id),
#             'email': user.email,
#             'username': user.username,
#         }

#         redirect_url = f"{base_url}?{urlencode(user_data)}"
#         logger.info(f"Redirecting to: {redirect_url}")
#         return redirect(redirect_url)

#     except Exception as e:
#         logger.error(f"Error in oauth_redirect_handler: {str(e)}", exc_info=True)
#         return redirect(f"{settings.FRONTEND_URL}/login?error=server_error")

# @csrf_exempt
# def oauth_redirect_handler(request):
#     logger.info("=== OAuth Redirect Handler Called ===")

#     if not request.user.is_authenticated:
#         return redirect(f"{settings.FRONTEND_URL}/login?error=auth_failed")

#     try:
#         user = request.user
#         tokens = get_tokens_for_user(user)

#         logger.info(f"Before update: user.last_login = {user.last_login}")

#         # Detect if this is the user's first login
#         is_new_user = user.last_login is None

#         # Update last_login
#         from django.contrib.auth.models import update_last_login
#         update_last_login(None, user)
#         logger.info(f"After update: user.last_login = {user.last_login}")

#         # Choose redirect path
#         redirect_path = "onboarding" if is_new_user else "dashboard"
#         base_url = f"{settings.FRONTEND_URL}/{redirect_path}"

#         # Prepare user data + flags
#         user_data = {
#             "access": tokens["access"],
#             "refresh": tokens["refresh"],
#             "user_id": str(user.user_id),
#             "email": user.email,
#             "username": user.username,
#             "is_new": "1" if is_new_user else "0",
#             "redirect": redirect_path,
#         }

#         # Build full redirect URL
#         redirect_url = f"{base_url}?{urlencode(user_data)}"
#         logger.info(f"Redirecting to: {redirect_url}")

#         return redirect(redirect_url)

#     except Exception as e:
#         logger.error(f"Error in oauth_redirect_handler: {str(e)}", exc_info=True)
#         return redirect(f"{settings.FRONTEND_URL}/login?error=server_error")


@csrf_exempt
def oauth_redirect_handler(request):
    logger.info("=== OAuth Redirect Handler Called ===")

    if not request.user.is_authenticated:
        return redirect(f"{settings.FRONTEND_URL}/login?error=auth_failed")

    try:
        user = request.user
        tokens = get_tokens_for_user(user)

        logger.info(f"Before update: user.last_login = {user.last_login}")

        # Detect new user: if registration happened recently (e.g. within 5 seconds)
        from django.utils import timezone
        import datetime

        time_diff = timezone.now() - user.registration_date
        is_new_user = time_diff.total_seconds() < 5

        # Update last_login
        from django.contrib.auth.models import update_last_login
        update_last_login(None, user)

        logger.info(f"After update: user.last_login = {user.last_login}")
        logger.info(f"is_new_user = {is_new_user}")

        # Choose redirect path
        redirect_path = "onboarding" if is_new_user else "dashboard"
        base_url = f"{settings.FRONTEND_URL}/{redirect_path}"

        # Data for frontend
        user_data = {
            "access": tokens["access"],
            "refresh": tokens["refresh"],
            "user_id": str(user.user_id),
            "email": user.email,
            "username": user.username,
            "is_new": "1" if is_new_user else "0",
            "redirect": redirect_path,
        }

        redirect_url = f"{base_url}?{urlencode(user_data)}"
        logger.info(f"Redirecting to: {redirect_url}")

        return redirect(redirect_url)

    except Exception as e:
        logger.error(f"Error in oauth_redirect_handler: {str(e)}", exc_info=True)
        return redirect(f"{settings.FRONTEND_URL}/login?error=server_error")


# Optional: API endpoint to manually fetch user info after OAuth
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_info(request):
    """Get current user information"""
    user = request.user
    tokens = get_tokens_for_user(user)
    
    return Response({
        'access': tokens['access'],
        'refresh': tokens['refresh'],
        'user': {
            'user_id': str(getattr(user, 'user_id', user.id)),
            'email': user.email,
            'username': user.username,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'is_profile_complete': getattr(user, 'is_profile_complete', True),
        }
    })
















def google_login_redirect(request):
    """
    Redirects the user straight to Google OAuth login page.
    """
    return redirect('/accounts/google/login/')

def github_login_redirect(request):
    """
    Redirect straight to GitHub OAuth login page.
    """
    return redirect('/accounts/github/login/')


# class RegisterView(generics.CreateAPIView):
#     queryset = User.objects.all()
#     serializer_class = RegisterSerializer
#     permission_classes = [AllowAny]

#     def post(self, request, *args, **kwargs):
#         serializer = self.get_serializer(data=request.data)
#         try:
#             serializer.is_valid(raise_exception=True)
#             refresh = RefreshToken.for_user(user)

#             user = serializer.save()
#             return Response({
#                 "message": "User registered successfully",
#                 "refresh": str(refresh),
#                 "access": str(refresh.access_token),
#                 "email": user.email,
#                 "googleId": getattr(user, "googleId", None),
#                 "githubId": getattr(user, "githubId", None),
#             }, status=status.HTTP_201_CREATED)

#         except IntegrityError as e:
#             # Example: duplicate email
#             return Response({"error": "A user with this email already exists."}, status=status.HTTP_400_BAD_REQUEST)
#         except Exception as e:
#             return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
            # Save user first
            user = serializer.save()

            # Generate tokens for the new user
            refresh = RefreshToken.for_user(user)
            access_token = refresh.access_token

            return Response({
                "message": "User registered successfully",
                "refresh": str(refresh),
                "access": str(access_token),
                "email": user.email,
                "googleId": getattr(user, "googleId", None),
                "githubId": getattr(user, "githubId", None),
            }, status=status.HTTP_201_CREATED)

        except IntegrityError:
            return Response(
                {"error": "A user with this email already exists."},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class LoginView(generics.GenericAPIView):
    serializer_class = LoginSerializer
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            user = serializer.validated_data['user']

            # OAuth handling: if Google or GitHub ID is provided, merge or create handled by serializer
            refresh = RefreshToken.for_user(user)

            return Response({
                "refresh": str(refresh),
                "access": str(refresh.access_token),
                "email": user.email,
                "googleId": getattr(user, "googleId", None),
                "githubId": getattr(user, "githubId", None),
            }, status=status.HTTP_200_OK)

        except ObjectDoesNotExist:
            return Response({"error": "User does not exist."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class PasswordResetRequestView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        google_id = request.data.get("googleId")
        github_id = request.data.get("githubId")

        if not email:
            return Response({"error": "Email is required"}, status=400)
        
        # disallow users who signup through google and github from resetting their passwords
        if google_id:
            return Response({"Please login with your Google account"}, status=400)
        if github_id:
            return Response({"Please login with your Github account"}, status=400)
        
        try:
            user = User.objects.get(email=email)
            token = PasswordResetTokenGenerator().make_token(user)
            uid = urlsafe_base64_encode(force_bytes(user.pk))

            reset_url = f"http://localhost:3000/reset-password/{uid}/{token}/"
            send_mail(
                subject="Password Reset Request",
                message=f"Click the link to reset your password: {reset_url}",
                from_email="noreply@joblinker.com",
                recipient_list=[email],
            )

            return Response({"message": "Password reset link sent"}, status=200)
        except User.DoesNotExist:
            return Response({"error": "User with this email does not exist"}, status=404)
        
        # catch any other errors like email send failed
        except Exception as e: 
            return Response({"error": str(e)}, status=400)



class PasswordResetConfirmView(generics.GenericAPIView):
    permission_classes = [AllowAny]

    def post(self, request, uidb64, token):
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)

            if not PasswordResetTokenGenerator().check_token(user, token):
                return Response({"error": "Invalid or expired token"}, status=400)

            new_password = request.data.get("password")
            user.set_password(new_password)
            user.save()

            return Response({"message": "Password has been reset"}, status=200)
        except Exception:
            return Response({"error": "Something went wrong"}, status=400)

class ChangePasswordView(generics.UpdateAPIView):
    serializer_class = ChangePasswordSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

    def update(self, request, *args, **kwargs):
        user = self.get_object()

        try:
            # only allow users with usable passwords
            if not user.has_usable_password():
                return Response(
                    {"error": "Users who signed up via Google or GitHub cannot change password."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)

            # check old password
            if not user.check_password(serializer.validated_data["old_password"]):
                return Response({"old_password": "Wrong password."}, status=status.HTTP_400_BAD_REQUEST)

            # set new password
            user.set_password(serializer.validated_data["new_password"])
            user.save()

            return Response({"message": "Password updated successfully"}, status=status.HTTP_200_OK)

        except DatabaseError as e:
            # Catch database-related errors
            return Response({"error": "Database error occurred. Please try again."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            # Catch all other unexpected errors
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
