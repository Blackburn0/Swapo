# accounts/adapters.py
from allauth.account.adapter import DefaultAccountAdapter
from allauth.socialaccount.adapter import DefaultSocialAccountAdapter
from django.contrib.auth import get_user_model
import logging
import uuid

logger = logging.getLogger(__name__)
User = get_user_model()


class CustomAccountAdapter(DefaultAccountAdapter):
    """Custom account adapter for regular account operations"""
    pass  # Keep default behavior


class CustomSocialAccountAdapter(DefaultSocialAccountAdapter):
    """Custom social account adapter for OAuth login"""
    
    def pre_social_login(self, request, sociallogin):
        """
        Connect social account to existing user with same email
        """
        logger.info(f"pre_social_login called for {sociallogin.account.provider}")
        
        # If this social account is already connected, skip
        if sociallogin.is_existing:
            logger.info("Social account already exists")
            return
        
        # Try to find user with matching email
        if sociallogin.email_addresses:
            email = sociallogin.email_addresses[0].email
            logger.info(f"Looking for existing user with email: {email}")
            
            try:
                user = User.objects.get(email=email)
                logger.info(f"Found existing user: {user.username}")
                # Connect this social login to the existing user
                sociallogin.connect(request, user)
                logger.info("Successfully connected social account to existing user")
            except User.DoesNotExist:
                logger.info("No existing user found, will create new one")
    
    def populate_user(self, request, sociallogin, data):
        """
        Populate user with data from social provider and ensure unique username
        """
        logger.info("populate_user called")
        user = super().populate_user(request, sociallogin, data)
        
        logger.info(f"User after populate: username='{user.username}', email='{user.email}'")
        
        # Ensure username is set
        if not user.username:
            logger.info("Username is empty, generating from email")
            base_username = user.email.split('@')[0] if user.email else f"user_{uuid.uuid4().hex[:8]}"
            user.username = base_username
            logger.info(f"Generated base username: {base_username}")
        
        # Ensure unique username
        original_username = user.username
        counter = 1
        
        while User.objects.filter(username=user.username).exists():
            logger.warning(f"Username '{user.username}' exists, trying another...")
            user.username = f"{original_username}{counter}"
            counter += 1
        
        logger.info(f"Final unique username: {user.username}")
        return user