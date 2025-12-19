from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.http import JsonResponse
from geopy.distance import geodesic
from rest_framework import generics
from datetime import date

from .models import Category, Site, Event, Review, User
from .serializers import CategorySerializer, SiteSerializer, EventSerializer, ReviewSerializer


# ------------------------------
# Category, Site, and Event APIs
# ------------------------------
class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class SiteViewSet(viewsets.ModelViewSet):
    queryset = Site.objects.all()
    serializer_class = SiteSerializer

    def get_queryset(self):
        queryset = Site.objects.all()
        category_id = self.request.query_params.get('category')
        if category_id:
            queryset = queryset.filter(category_id=category_id)
        return queryset


class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer

    def get_queryset(self):
        site_id = self.request.query_params.get('site_id')
        if site_id:
            return Event.objects.filter(site_id=site_id)
        return Event.objects.all()


class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer


# ------------------------------
# Review APIs
# ------------------------------
@api_view(['GET'])
def get_reviews(request):
    site_id = request.GET.get("site_id")
    event_id = request.GET.get("event_id")

    reviews = Review.objects.all()

    if site_id:
        reviews = reviews.filter(site_id=site_id)

    if event_id:
        reviews = reviews.filter(event_id=event_id)

    serializer = ReviewSerializer(reviews, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([AllowAny])
def add_review(request):
    user_id = request.data.get('user_id')
    site_id = request.data.get('site_id')
    rating = request.data.get('rating')
    review_comment = request.data.get('review_comment')

    if not user_id or not site_id:
        return Response({'error': 'user_id and site_id are required'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.get(user_id=user_id)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

    review = Review.objects.create(
        user=user,
        site_id=site_id,
        rating=rating,
        review_comment=review_comment
    )

    serializer = ReviewSerializer(review)
    return Response(serializer.data, status=status.HTTP_201_CREATED)


# ------------------------------
# Geo-based Event APIs
# ------------------------------
def get_nearby_events(request):
    lat = float(request.GET.get("lat", 0))
    lng = float(request.GET.get("lng", 0))
    radius = float(request.GET.get("radius", 25))
    user_loc = (lat, lng)

    events = []
    for e in Event.objects.all():
        if hasattr(e, 'latitude') and hasattr(e, 'longitude'):
            dist = geodesic(user_loc, (e.latitude, e.longitude)).km
            if dist <= radius:
                events.append({
                    "name": e.event_name,
                    "date": e.start_date.strftime("%Y-%m-%d"),
                    "description": e.description,
                    "distance": dist,
                })
    return JsonResponse(events, safe=False)


def get_events_by_location(request):
    location = request.GET.get("location", "").lower()
    events = Event.objects.filter(
        site__city__icontains=location
    ) | Event.objects.filter(site__state__icontains=location)
    data = [
        {
            "name": e.event_name,
            "date": e.start_date.strftime("%Y-%m-%d"),
            "description": e.description,
        }
        for e in events
    ]
    return JsonResponse(data, safe=False)


# ✅ Optional endpoint: fetch only upcoming events globally
@api_view(['GET'])
@permission_classes([AllowAny])
def get_upcoming_events(request):
    today = date.today()
    events = Event.objects.filter(start_date__gte=today).order_by('start_date')
    serializer = EventSerializer(events, many=True)
    return Response(serializer.data)

class SiteListView(generics.ListAPIView):
    queryset = Site.objects.all()
    serializer_class = SiteSerializer


class SiteDetailView(generics.RetrieveAPIView):
    queryset = Site.objects.all()
    serializer_class = SiteSerializer
from django.views.decorators.csrf import csrf_exempt
import json
from django.http import JsonResponse
from django.contrib.auth.hashers import make_password, check_password
from .models import User  # ✅ your custom user table
@csrf_exempt
def register_user(request):
    if request.method != "POST":
        return JsonResponse({"error": "Invalid request method"}, status=400)

    data = json.loads(request.body)

    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    if User.objects.filter(email=email).exists():
        return JsonResponse({"error": "Email already exists"}, status=400)

    user = User.objects.create(
        username=username,
        email=email,
        password=make_password(password)
    )

    return JsonResponse({
        "message": "User registered successfully",
        "user_id": user.user_id,
        "username": user.username
    })
@csrf_exempt
def login_user(request):
    if request.method != "POST":
        return JsonResponse({"error": "Invalid request method"}, status=400)

    data = json.loads(request.body)
    email = data.get("email")
    password = data.get("password")

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return JsonResponse({"error": "User not found"}, status=404)

    if not check_password(password, user.password):
        return JsonResponse({"error": "Incorrect password"}, status=400)

    return JsonResponse({
        "message": "Login successful",
        "user_id": user.user_id,
        "username": user.username
    })
