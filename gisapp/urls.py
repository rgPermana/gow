from django.urls import path
from . import views

urlpatterns = [
    path('spatial-data/', views.spatial_data_list, name='spatial_data_list'),
    path('spatial-data/create/', views.spatial_data_create, name='spatial_data_create'),
]
