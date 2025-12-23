from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User
from rest_framework import serializers
from django.contrib.auth import password_validation
from cloudinary.uploader import upload as cloudinary_upload

from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User, UserPrivacy
from django.contrib.auth import password_validation
import logging
from listings.serializers import SkillListingSerializer
from listings.models import PortfolioImage

logger = logging.getLogger(__name__)

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    googleId = serializers.CharField(write_only=True, required=False)
    githubId = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = ["email", "password", "googleId", "githubId"]

    def validate_email(self, value):
        """
        Check that the email is unique for regular signups
        """
        logger.info(f"validate_email called with: {value}")
        
        # Normalize email
        value = value.lower().strip()
        
        # Check if email exists
        exists = User.objects.filter(email=value).exists()
        logger.info(f"Email {value} exists in DB: {exists}")
        
        if exists:
            logger.error(f"Email {value} already exists!")
            raise serializers.ValidationError("A user with this email already exists.")
        
        logger.info(f"Email {value} is unique, proceeding...")
        return value

    def validate(self, data):
        logger.info(f"validate called with data: {data}")
        email = data.get("email")
        
        # Generate username from email
        if email:
            base_username = email.split('@')[0]
            generated_username = base_username
            counter = 1
            
            logger.info(f"Generating username from email: {email}")
            logger.info(f"Base username: {base_username}")
            
            # Ensure username is unique
            while User.objects.filter(username=generated_username).exists():
                logger.warning(f"Username {generated_username} exists, trying next...")
                generated_username = f"{base_username}{counter}"
                counter += 1
            
            logger.info(f"Final unique username: {generated_username}")
            data['username'] = generated_username
        
        return data

    def create(self, validated_data):
        logger.info(f"create called with validated_data: {validated_data}")
        
        username = validated_data.pop("username")
        google_id = validated_data.pop("googleId", None)
        github_id = validated_data.pop("githubId", None)
        password = validated_data.pop("password", None)

        logger.info(f"Creating user with username: {username}, email: {validated_data.get('email')}")
        
        try:
            # Create new user
            user = User.objects.create_user(
                **validated_data,
                username=username,
                password=password or User.objects.make_random_password(),
                googleId=google_id,
                githubId=github_id
            )
            logger.info(f"User created successfully: {user.user_id}")
            return user
        except Exception as e:
            logger.error(f"Error creating user: {str(e)}")
            raise

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    googleId=serializers.CharField(write_only=True, required=False)
    githubId=serializers.CharField(write_only=True, required=False)

    def validate(self, data):
        email = data.get("email")
        password=data.get("password")
        google_id=data.get("googleId")
        github_id=data.get("githubId")
        user = None

        # Login via Google ID
        if google_id:
            user = User.objects.filter(googleId=google_id).first()
            if not user:
                raise serializers.ValidationError("Google account not registered.")
        
        # Login via Github ID
        elif github_id:
            user = User.objects.filter(githubId=github_id).first()
            if not user:
                raise serializers.ValidationError("Github account not registered.")
        
        # Fallback to Email/Password auth
        elif email and password:
            user = authenticate(email=data["email"], password=data["password"])
            if not user:
                raise serializers.ValidationError("Invalid email or password")
        
        # Handle general failure if no credentials were provided
        else:
            raise serializers.ValidationError("Login through either email/password, google or github")

        # Attach the authenticated 'user' object to the data dictionary
        data['user'] = user 
        return data 

class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True, min_length=6)
    confirm_password = serializers.CharField(write_only=True, min_length=6)

    def validate(self, data):
        if data["new_password"] != data["confirm_password"]:
            raise serializers.ValidationError({"confirm_password": "Passwords do not match."})
        password_validation.validate_password(data["new_password"])
        return data

class UpdateProfileSerializer(serializers.ModelSerializer):
    profile_picture_url = serializers.ImageField(required=False)

    class Meta:
        model = User
        fields = [
            "username",
            "first_name",
            "last_name",
            "role",
            "bio",
            "profile_picture_url",
            "location",
            "is_profile_complete",
        ]
        extra_kwargs = {
            "is_profile_complete": {"read_only": True},  
        }

    def update(self, instance, validated_data):
        image = validated_data.pop("profile_picture_url", None)

        if image:
            upload_result = cloudinary_upload(image)
            instance.profile_picture_url = upload_result.get("secure_url")

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        # Automatically mark profile as complete if key fields are filled
        if instance.bio and instance.location and instance.profile_picture_url:
            instance.is_profile_complete = True
        instance.save()
        return instance


class UserPrivacySerializer(serializers.ModelSerializer):
    class Meta:
        model = UserPrivacy
        fields = ["public_profile", "public_skills", "public_trades", "contact_option"]


class PublicUserSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = User
        fields = [
            "user_id",
            "email",
            "username",
            "first_name",
            "last_name",
            "role",
            "location",
            "bio",
            "profile_picture_url",
            "is_profile_complete",
        ]


class PublicUserWithListingsSerializer(PublicUserSerializer):
    listings = SkillListingSerializer(many=True, read_only=True)

    class Meta(PublicUserSerializer.Meta):
        fields = PublicUserSerializer.Meta.fields + ["listings"]