from django.db import models
from datetime import date


class User(models.Model):
    user_id = models.AutoField(primary_key=True)
    username = models.CharField(max_length=255)
    password = models.CharField(max_length=255)
    email = models.EmailField()

    class Meta:
        db_table = 'users'

    def __str__(self):
        return self.username


class Category(models.Model):
    category_id = models.AutoField(primary_key=True)
    category_name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)

    class Meta:
        db_table = 'categories'

    def __str__(self):
        return self.category_name


class Site(models.Model):
    site_id = models.AutoField(primary_key=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, db_column='category_id')
    site_name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    city = models.CharField(max_length=255)
    state = models.CharField(max_length=255)
    visiting_hours = models.CharField(max_length=255, blank=True, null=True)
    entry_fee = models.CharField(max_length=50, blank=True, null=True)
    images = models.URLField(max_length=500, blank=True, null=True)
    location_link = models.URLField(max_length=255, blank=True, null=True)
    
    class Meta:
        db_table = 'sites'

    def __str__(self):
        return self.site_name

    # ✅ Property for upcoming events
    @property
    def upcoming_events(self):
        return self.events.filter(start_date__gte=date.today()).order_by('start_date')


class Event(models.Model):
    event_id = models.AutoField(primary_key=True)
    event_name = models.CharField(max_length=255)
    site = models.ForeignKey(
        Site,
        on_delete=models.CASCADE,
        db_column='site_id',
        related_name='events'  # ✅ allows Site.events.all()
    )
    description = models.TextField(blank=True, null=True)
    start_date = models.DateField()
    end_date = models.DateField()
    venue = models.CharField(max_length=255)
    image_url = models.URLField(max_length=500, blank=True, null=True)
    location_link = models.URLField(max_length=500, blank=True, null=True)

    class Meta:
        db_table = 'events'

    def __str__(self):
        return self.event_name


class Review(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, db_column='user_id', primary_key=True)
    site = models.ForeignKey(Site, on_delete=models.CASCADE, db_column='site_id')
    rating = models.IntegerField(blank=True, null=True)
    review_comment = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'reviews'
        unique_together = (('user', 'site'),)
        managed = False

    def __str__(self):
        return f"Review by {self.user.username} on {self.site.site_name}"
