from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.utils import timezone
import uuid

class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("Users must have an email address")
        email = self.normalize_email(email)

        username = extra_fields.pop("username", None)
        if not username:
            username = f"user_{uuid.uuid4().hex[:12]}"

        # Check for existing user with same email
        existing_user = self.model.objects.filter(email=email).first()
        if existing_user:
            # Update IDs if provided
            google_id = extra_fields.get("googleId")
            github_id = extra_fields.get("githubId")
            if google_id and not existing_user.googleId:
                existing_user.googleId = google_id
            if github_id and not existing_user.githubId:
                existing_user.githubId = github_id
            existing_user.save(using=self._db)
            return existing_user

        user = self.model(email=email, username=username, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    user_id = models.AutoField(primary_key=True)
    username = models.CharField(max_length=150)
    email = models.EmailField(unique=True)
    password_hash = models.CharField(max_length=128)
    bio = models.TextField(blank=True, null=True)
    profile_picture_url = models.URLField(blank=True, null=True)
    location = models.CharField(max_length=255, blank=True, null=True)
    registration_date = models.DateTimeField(default=timezone.now)
    last_login = models.DateTimeField(blank=True, null=True)
    rating = models.DecimalField(max_digits=3, decimal_places=2, blank=True, null=True)
    num_reviews = models.IntegerField(default=0)
    googleId = models.CharField(unique=True, max_length=255, blank=True, null=True)
    githubId = models.CharField(unique=True, max_length=255, blank=True, null=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    
    # ✅ Add this field for OAuth users
    is_profile_complete = models.BooleanField(default=False)

    @property
    def id(self):
        return self.user_id

    objects = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email