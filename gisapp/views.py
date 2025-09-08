from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.contrib.gis.geos import Point
from .models import SpatialData
import json

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
            point = Point(data['lng'], data['lat'])
            
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
                    }
                }
            })
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)})
    
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
