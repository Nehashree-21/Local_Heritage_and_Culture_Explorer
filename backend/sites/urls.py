from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from .views import SiteListView, SiteDetailView ,SiteViewSet, EventViewSet, CategoryViewSet, ReviewViewSet

router = DefaultRouter()
router.register(r'sites', SiteViewSet)
router.register(r'events', EventViewSet)
router.register(r'categories', CategoryViewSet)
router.register(r'reviews', ReviewViewSet)

urlpatterns = [
    path('', include(router.urls)),

    # Custom APIs
    path('events/nearby/', views.get_nearby_events),
    path('events/by-location/', views.get_events_by_location),
    path('events/upcoming/', views.get_upcoming_events, name='upcoming_events'),
    path('reviews/', views.get_reviews, name='get_reviews'),
    path('reviews/add/', views.add_review, name='add_review'),
]
from .views import register_user, login_user

urlpatterns += [
    path("register/", register_user, name="register"),
    path("login/", login_user, name="login"),
]

