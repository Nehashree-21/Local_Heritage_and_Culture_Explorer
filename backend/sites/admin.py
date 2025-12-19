# myapp/admin.py
from django.contrib import admin
from .models import Site, Event, Review,Category

admin.site.register(Site)
admin.site.register(Event)
admin.site.register(Review)
admin.site.register(Category)