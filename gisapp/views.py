from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
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
