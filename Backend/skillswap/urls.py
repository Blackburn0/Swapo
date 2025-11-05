"""
URL configuration for skillswap project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.views.generic import TemplateView

from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse
from django.shortcuts import redirect


urlpatterns = [
    path("admin/", admin.site.urls),

    path("", lambda request: HttpResponse("Welcome to SkillSwap!")), 

      # Auth endpoints
    path("api/v1/auth/", include("accounts.urls")),
    path("api/v1/auth/", include("dj_rest_auth.urls")),
    path("api/v1/auth/registration/", include("dj_rest_auth.registration.urls")),

    # Social login (google/github) — Allauth handles provider logic
    path("accounts/", include("allauth.urls")),
    path("accounts/oauth/callback/", lambda request: redirect("/api/v1/auth/oauth/callback/")),





    # user-skill endpoints
    path("api/v1/user-skills/", include("userSkills.urls")),
    # Other endpoints
    path("api/v1/skills/", include('skills.urls')),
    path("api/v1/listings/", include("listings.urls")),
    path("api/v1/reviews/", include("reviews.urls")),
    path("api/v1/userblocks/", include("userblocks.urls")),

    path('api/v1/trades/', include('trade.urls')),
    path('api/v1/notifications/', include('notification.urls')),
    path('api/v1/messages/', include('message.urls')),


    # then in urlpatterns
    path("api/docs/", TemplateView.as_view(template_name="api_docs.html"), name="api-docs"),

]


# check site_id in shell
# python manage.py shell
# from django.contrib.sites.models import Site

# for site in Site.objects.all():
#     print(site.id, site.domain, site.name)
