from django.urls import path
from . import views

urlpatterns = [
    # GET/POST - List semua data atau create data baru
    path('spatial-data/', views.spatial_data_unified, name='spatial_data_unified'),
    
    # GET, PUT, DELETE - Detail, Update, Delete berdasarkan ID
    path('spatial-data/<int:pk>/', views.spatial_data_detail, name='spatial_data_detail'),
]
