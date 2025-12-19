# backend/backend/urls.py
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),

    # 🏛️ Heritage sites, events, categories, reviews, etc.
    path('api/', include('sites.urls')),
]
