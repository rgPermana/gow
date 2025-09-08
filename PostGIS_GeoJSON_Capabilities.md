# 🗄️ PostGIS dan GeoJSON: Kemampuan Lengkap untuk Data Spasial

## ✅ **Ya, PostGIS Dapat Menyimpan dan Mengelola Data GeoJSON!**

PostGIS memiliki dukungan penuh untuk GeoJSON dan dapat melakukan berbagai operasi dengan format ini.

## 🚀 **Kemampuan PostGIS dengan GeoJSON**

### **1. Import GeoJSON ke PostGIS**
```sql
-- Import geometry dari GeoJSON string
INSERT INTO gisapp_spatialdata (name, description, location) 
VALUES (
    'Jakarta',
    'Ibu kota Indonesia',
    ST_GeomFromGeoJSON('{"type":"Point","coordinates":[106.8451,-6.2088]}')
);

-- Import dengan validasi
SELECT ST_IsValid(ST_GeomFromGeoJSON('{"type":"Point","coordinates":[106.8451,-6.2088]}'));
```

### **2. Export PostGIS ke GeoJSON**
```sql
-- Export single geometry sebagai GeoJSON
SELECT ST_AsGeoJSON(location) as geojson_geometry
FROM gisapp_spatialdata 
WHERE name = 'Jakarta';

-- Export FeatureCollection lengkap
SELECT json_build_object(
    'type', 'FeatureCollection',
    'features', json_agg(
        json_build_object(
            'type', 'Feature',
            'geometry', ST_AsGeoJSON(location)::json,
            'properties', json_build_object(
                'id', id,
                'name', name,
                'description', description,
                'created_at', created_at
            )
        )
    )
) as complete_geojson
FROM gisapp_spatialdata;
```

### **3. Validasi GeoJSON**
```sql
-- Cek apakah GeoJSON valid
SELECT ST_IsValid(ST_GeomFromGeoJSON('{"type":"Point","coordinates":[106.8451,-6.2088]}'));

-- Cek koordinat dalam range yang benar
SELECT 
    CASE 
        WHEN ST_X(location) BETWEEN -180 AND 180 AND ST_Y(location) BETWEEN -90 AND 90 
        THEN 'Valid coordinates'
        ELSE 'Invalid coordinates'
    END as coordinate_check
FROM gisapp_spatialdata;
```

## 🔧 **Implementasi dalam GOW Application**

### **Storage Format di Database:**
```sql
-- Struktur tabel dengan PostGIS
CREATE TABLE gisapp_spatialdata (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    location GEOMETRY(POINT, 4326) NOT NULL,  -- PostGIS Point dengan SRID 4326
    created_at TIMESTAMPTZ NOT NULL
);

-- Index spatial untuk performa
CREATE INDEX idx_gisapp_spatialdata_location ON gisapp_spatialdata USING GIST (location);
```

### **Django Model Integration:**
```python
# models.py
from django.contrib.gis.db import models

class SpatialData(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    location = models.PointField()  # PostGIS POINT geometry
    created_at = models.DateTimeField(auto_now_add=True)
```

### **API Response Format:**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Jakarta",
      "description": "Ibu kota Indonesia",
      "location": {
        "lat": -6.2088,
        "lng": 106.8451
      },
      "created_at": "2025-09-08T11:38:05.583629+00:00"
    }
  ]
}
```

## 🛠️ **Troubleshooting Import GeoJSON Error**

### **Error: "No valid features could be imported"**

#### **Kemungkinan Penyebab & Solusi:**

1. **❌ Format GeoJSON Salah**
   ```javascript
   // SALAH - Missing FeatureCollection wrapper
   {
     "type": "Feature",
     "geometry": {...}
   }
   
   // BENAR - Proper FeatureCollection
   {
     "type": "FeatureCollection",
     "features": [
       {
         "type": "Feature",
         "geometry": {...},
         "properties": {...}
       }
     ]
   }
   ```

2. **❌ Koordinat di Luar Range**
   ```javascript
   // SALAH - Latitude > 90
   "coordinates": [106.8451, 91.0]
   
   // BENAR - Valid coordinates
   "coordinates": [106.8451, -6.2088]
   ```

3. **❌ Geometry Type Tidak Didukung**
   ```javascript
   // SALAH - LineString belum didukung
   "geometry": {
     "type": "LineString",
     "coordinates": [[...], [...]]
   }
   
   // BENAR - Point didukung
   "geometry": {
     "type": "Point",
     "coordinates": [106.8451, -6.2088]
   }
   ```

4. **❌ Properties Kosong/Missing**
   ```javascript
   // BISA BERMASALAH - Properties kosong
   "properties": {}
   
   // LEBIH BAIK - Ada name minimal
   "properties": {
     "name": "Location Name"
   }
   ```

### **Debug Steps yang Sudah Diimplementasikan:**

1. **✅ Enhanced Logging**
   - Console log setiap step import
   - Detail error untuk setiap feature
   - Coordinate validation

2. **✅ Flexible Property Mapping**
   ```javascript
   // Multiple property name options
   name: properties.name || properties.title || properties.label || `Imported Point ${i + 1}`
   description: properties.description || properties.desc || properties.comment || 'Imported from GeoJSON'
   ```

3. **✅ Coordinate Validation**
   ```javascript
   // Range validation
   if (lat < -90 || lat > 90) {
     errors.push(`Feature ${i + 1}: Latitude ${lat} out of range (-90 to 90)`);
     continue;
   }
   
   if (lng < -180 || lng > 180) {
     errors.push(`Feature ${i + 1}: Longitude ${lng} out of range (-180 to 180)`);
     continue;
   }
   ```

4. **✅ Detailed Error Reporting**
   - Shows exactly which features failed
   - Specific error messages for each validation
   - Success/failure count

## 🧪 **File Test yang Disediakan**

### **1. Simple Test (2 features):**
```bash
/home/rengga/00_GISBase_Fedora/gow/test_simple.geojson
```

### **2. Indonesia Cities (10 features):**
```bash
/home/rengga/00_GISBase_Fedora/gow/sample_indonesia_cities.geojson
```

### **Cara Testing:**
1. **Buka Dashboard**: http://localhost:3000 → "Dashboard"
2. **Klik "Import GeoJSON"**
3. **Pilih file test**
4. **Lihat console browser** (F12) untuk detail debugging
5. **Cek alert message** untuk hasil import

## 📊 **PostGIS Performance dengan GeoJSON**

### **Query Performance:**
```sql
-- Fast spatial queries dengan index GIST
SELECT name, ST_AsGeoJSON(location) 
FROM gisapp_spatialdata 
WHERE ST_DWithin(location, ST_GeomFromGeoJSON('{"type":"Point","coordinates":[106.8451,-6.2088]}'), 0.1);

-- Bulk export ke GeoJSON
COPY (
    SELECT ST_AsGeoJSON(json_build_object(
        'type', 'FeatureCollection',
        'features', array_agg(feature)
    ))
    FROM (
        SELECT json_build_object(
            'type', 'Feature',
            'geometry', ST_AsGeoJSON(location)::json,
            'properties', json_build_object('name', name, 'description', description)
        ) as feature
        FROM gisapp_spatialdata
    ) subquery
) TO '/tmp/export.geojson';
```

### **Storage Efficiency:**
- **PostGIS Binary**: Optimal storage dalam database
- **GeoJSON Export**: Human-readable untuk sharing
- **Index Support**: GIST index untuk spatial queries
- **SRID Management**: Coordinate system tracking

## 🎯 **Best Practices**

### **1. Data Validation:**
- Always validate coordinate ranges
- Check geometry type support
- Verify property structure

### **2. Error Handling:**
- Partial import pada error
- Detailed error messages
- Transaction rollback bila perlu

### **3. Performance:**
- Batch insert untuk large datasets
- Use spatial indexes
- Monitor memory usage

### **4. Security:**
- Validate file size limits
- Sanitize property values
- Rate limiting untuk API

---

**🎉 PostGIS + GeoJSON = Powerful Spatial Data Management!**

Kombinasi PostGIS dan GeoJSON memberikan fleksibilitas tinggi untuk storage, query, dan sharing data spasial dalam aplikasi GOW.
