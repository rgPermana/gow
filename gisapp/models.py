from django.contrib.gis.db import models

class SpatialData(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    location = models.PointField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = "Spatial Data"
        verbose_name_plural = "Spatial Data"
