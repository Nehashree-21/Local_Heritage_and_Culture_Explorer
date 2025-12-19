from rest_framework import serializers
from .models import Category, Site, Event, Review, User


# ------------------------------
# User Serializer
# ------------------------------
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['user_id', 'username', 'email']


# ------------------------------
# Category Serializer
# ------------------------------
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


# ------------------------------
# Event Serializer
# ------------------------------
class EventSerializer(serializers.ModelSerializer):
    site_name = serializers.CharField(source='site.site_name', read_only=True)

    class Meta:
        model = Event
        fields = [
            'event_id',
            'event_name',
            'description',
            'start_date',
            'end_date',
            'venue',
            'site',
            'site_name',
            'image_url',       # ✅ Added
            'location_link',
        ]
class ReviewSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    site_name = serializers.CharField(source='site.site_name', read_only=True)

    class Meta:
        model = Review
        fields = [
            'user',
            'username',
            'site',
            'site_name',
            'rating',
            'review_comment',
            'created_at',
        ]


# ------------------------------
# Site Serializer
# ------------------------------
class SiteSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.category_name', read_only=True)
    events = EventSerializer(many=True, read_only=True)
    reviews = serializers.SerializerMethodField() # ✅ use custom method

    class Meta:
        model = Site
        fields = [
            'site_id',
            'category',
            'category_name',
            'site_name',
            'description',
            'city',
            'state',
            'visiting_hours',
            'entry_fee',
            'images',
            'location_link',
            'events',
            'reviews',
        ]

    def get_events(self, obj):
        """Return only upcoming events"""
        events = obj.upcoming_events
        return EventSerializer(events, many=True).data
    def get_reviews(self, obj):
        from .models import Review
        from .serializers import ReviewSerializer
        reviews = Review.objects.filter(site=obj)
        return ReviewSerializer(reviews, many=True).data

# ------------------------------
# Review Serializer
# ------------------------------
