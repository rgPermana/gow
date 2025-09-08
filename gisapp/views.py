from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.contrib.gis.geos import Point
from .models import SpatialData
import json

@csrf_exempt
def spatial_data_unified(request):
    """
    API endpoint unified untuk GET (list) dan POST (create) data spasial
    """
    if request.method == 'GET':
        # LIST - Ambil semua data
        data = []
        for item in SpatialData.objects.all():
            data.append({
                'id': item.id,
                'name': item.name,
                'description': item.description,
                'location': {
                    'lat': item.location.y,
                    'lng': item.location.x
                },
                'created_at': item.created_at.isoformat()
            })
        
        return JsonResponse({'data': data})
    
    elif request.method == 'POST':
        # CREATE - Buat data baru
        try:
            data = json.loads(request.body)
            
            # Support both format: direct lng/lat and nested location object
            if 'location' in data and isinstance(data['location'], dict):
                # New format: {"location": {"lat": -6.2088, "lng": 106.8451}}
                lng = data['location']['lng']
                lat = data['location']['lat']
            else:
                # Old format: {"lng": 106.8451, "lat": -6.2088}
                lng = data['lng']
                lat = data['lat']
            
            # Validate coordinates
            if not isinstance(lng, (int, float)) or not isinstance(lat, (int, float)):
                return JsonResponse({'success': False, 'error': 'Invalid coordinate format'}, status=400)
            
            if lat < -90 or lat > 90:
                return JsonResponse({'success': False, 'error': f'Latitude {lat} out of range (-90 to 90)'}, status=400)
            
            if lng < -180 or lng > 180:
                return JsonResponse({'success': False, 'error': f'Longitude {lng} out of range (-180 to 180)'}, status=400)
            
            point = Point(lng, lat)
            
            spatial_data = SpatialData.objects.create(
                name=data['name'],
                description=data.get('description', ''),
                location=point
            )
            
            return JsonResponse({
                'success': True,
                'data': {
                    'id': spatial_data.id,
                    'name': spatial_data.name,
                    'description': spatial_data.description,
                    'location': {
                        'lat': spatial_data.location.y,
                        'lng': spatial_data.location.x
                    },
                    'created_at': spatial_data.created_at.isoformat()
                }
            })
        except KeyError as e:
            return JsonResponse({'success': False, 'error': f'Missing required field: {str(e)}'}, status=400)
        except json.JSONDecodeError:
            return JsonResponse({'success': False, 'error': 'Invalid JSON format'}, status=400)
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)}, status=500)
    
    return JsonResponse({'error': 'Method not allowed'}, status=405)

def spatial_data_list(request):
    """
    API endpoint untuk mengambil semua data spasial
    """
    data = []
    for item in SpatialData.objects.all():
        data.append({
            'id': item.id,
            'name': item.name,
            'description': item.description,
            'location': {
                'lat': item.location.y,
                'lng': item.location.x
            },
            'created_at': item.created_at.isoformat()
        })
    
    return JsonResponse({'data': data})

@csrf_exempt
def spatial_data_create(request):
    """
    API endpoint untuk membuat data spasial baru
    """
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            # Support both format: direct lng/lat and nested location object
            if 'location' in data and isinstance(data['location'], dict):
                # New format: {"location": {"lat": -6.2088, "lng": 106.8451}}
                lng = data['location']['lng']
                lat = data['location']['lat']
            else:
                # Old format: {"lng": 106.8451, "lat": -6.2088}
                lng = data['lng']
                lat = data['lat']
            
            # Validate coordinates
            if not isinstance(lng, (int, float)) or not isinstance(lat, (int, float)):
                return JsonResponse({'success': False, 'error': 'Invalid coordinate format'}, status=400)
            
            if lat < -90 or lat > 90:
                return JsonResponse({'success': False, 'error': f'Latitude {lat} out of range (-90 to 90)'}, status=400)
            
            if lng < -180 or lng > 180:
                return JsonResponse({'success': False, 'error': f'Longitude {lng} out of range (-180 to 180)'}, status=400)
            
            point = Point(lng, lat)
            
            spatial_data = SpatialData.objects.create(
                name=data['name'],
                description=data.get('description', ''),
                location=point
            )
            
            return JsonResponse({
                'success': True,
                'data': {
                    'id': spatial_data.id,
                    'name': spatial_data.name,
                    'description': spatial_data.description,
                    'location': {
                        'lat': spatial_data.location.y,
                        'lng': spatial_data.location.x
                    },
                    'created_at': spatial_data.created_at.isoformat()
                }
            })
        except KeyError as e:
            return JsonResponse({'success': False, 'error': f'Missing required field: {str(e)}'}, status=400)
        except json.JSONDecodeError:
            return JsonResponse({'success': False, 'error': 'Invalid JSON format'}, status=400)
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)}, status=500)
    
    return JsonResponse({'error': 'Method not allowed'}, status=405)

@csrf_exempt
def spatial_data_detail(request, pk):
    """
    API endpoint untuk detail, update, dan delete data spasial
    """
    try:
        spatial_data = get_object_or_404(SpatialData, pk=pk)
    except SpatialData.DoesNotExist:
        return JsonResponse({'error': 'Data not found'}, status=404)
    
    if request.method == 'GET':
        # READ - Detail data
        return JsonResponse({
            'success': True,
            'data': {
                'id': spatial_data.id,
                'name': spatial_data.name,
                'description': spatial_data.description,
                'location': {
                    'lat': spatial_data.location.y,
                    'lng': spatial_data.location.x
                },
                'created_at': spatial_data.created_at.isoformat()
            }
        })
    
    elif request.method == 'PUT':
        # UPDATE - Edit data
        try:
            data = json.loads(request.body)
            
            if 'name' in data:
                spatial_data.name = data['name']
            if 'description' in data:
                spatial_data.description = data['description']
            if 'lat' in data and 'lng' in data:
                spatial_data.location = Point(data['lng'], data['lat'])
            
            spatial_data.save()
            
            return JsonResponse({
                'success': True,
                'data': {
                    'id': spatial_data.id,
                    'name': spatial_data.name,
                    'description': spatial_data.description,
                    'location': {
                        'lat': spatial_data.location.y,
                        'lng': spatial_data.location.x
                    },
                    'created_at': spatial_data.created_at.isoformat()
                }
            })
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)})
    
    elif request.method == 'DELETE':
        # DELETE - Hapus data
        try:
            spatial_data.delete()
            return JsonResponse({'success': True, 'message': 'Data deleted successfully'})
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)})
    
    return JsonResponse({'error': 'Method not allowed'}, status=405)
