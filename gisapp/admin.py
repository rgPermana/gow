from django.contrib import admin
from django.contrib.gis.admin import GISModelAdmin
from .models import SpatialData

@admin.register(SpatialData)
class SpatialDataAdmin(GISModelAdmin):
    list_display = ('name', 'description', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('name', 'description')
    readonly_fields = ('created_at',)
