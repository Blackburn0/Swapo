from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView
from django.shortcuts import redirect

from .views import RegisterView, LoginView, PasswordResetRequestView, PasswordResetConfirmView, ChangePasswordView, google_login_redirect, github_login_redirect, oauth_redirect_handler, get_user_info, UpdateProfileView, UserPrivacyView, DeleteAccountView, OtherUserProfileView, UserPortfolioImagesView

urlpatterns = [
    path("signup/", RegisterView.as_view(), name="signup"),
    path("login/", LoginView.as_view(), name="login"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("password/forgot/", PasswordResetRequestView.as_view(), name="password_reset_request"),
    path("password/reset/<uidb64>/<token>/", PasswordResetConfirmView.as_view(), name="password_reset_confirm"),
    path("change-password/", ChangePasswordView.as_view(), name="change_password"),

    path("me/", get_user_info, name="get_user_info"),
    path("me/update/", UpdateProfileView.as_view(), name="update_profile"),
    path("me/portfolio-images/", UserPortfolioImagesView.as_view(), name="user-portfolio-images"),
    path('users/<int:user_id>/', OtherUserProfileView.as_view(), name='other-user-profile'),
    path("privacy/", UserPrivacyView.as_view(), name="user-privacy"),
    path("delete-account/", DeleteAccountView.as_view(), name="delete-account"),

    
    # Custom redirect endpoints for Google OAuth2 and Github OAuth
    path('google/', google_login_redirect, name='google-login-redirect'),
    path("github/", github_login_redirect, name="github-login-redirect"),

    path('oauth/callback/', oauth_redirect_handler, name='oauth_callback'),
    # path('', include('allauth.urls')),


]

# Google flow
# GET /api/v1/auth/google/  --> redirect to Google login
# Google OAuth login
