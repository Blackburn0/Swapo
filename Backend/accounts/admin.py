from django.contrib import admin
from .models import User, UserPrivacy
# Register your models here.

admin.site.register([User, UserPrivacy])