from django.urls import path
from . import views

urlpatterns = [
    # GET - List semua data
    path('spatial-data/', views.spatial_data_list, name='spatial_data_list'),
    
    # POST - Create data baru
    path('spatial-data/create/', views.spatial_data_create, name='spatial_data_create'),
    
    # GET, PUT, DELETE - Detail, Update, Delete berdasarkan ID
    path('spatial-data/<int:pk>/', views.spatial_data_detail, name='spatial_data_detail'),
]
