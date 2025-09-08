# Contoh File GeoJSON dengan Multiple Data

## 📁 Struktur GeoJSON untuk Multiple Features

Berikut adalah contoh file GeoJSON yang berisi banyak data spatial dalam satu file:

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [106.8451, -6.2088]
      },
      "properties": {
        "id": 1,
        "name": "Jakarta",
        "description": "Ibu kota Indonesia",
        "created_at": "2025-09-08T11:38:05.583629Z"
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [107.6191, -6.9175]
      },
      "properties": {
        "id": 2,
        "name": "Bandung",
        "description": "Kota Kembang",
        "created_at": "2025-09-08T11:37:37.219752Z"
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [112.7521, -7.2575]
      },
      "properties": {
        "id": 3,
        "name": "Surabaya",
        "description": "Kota Pahlawan",
        "created_at": "2025-09-08T11:37:37.223211Z"
      }
    }
  ]
}
```

## 🗂️ Keunggulan GeoJSON untuk Multiple Data:

1. **FeatureCollection**: Dapat menampung ratusan bahkan ribuan features
2. **Standar Format**: Didukung oleh semua software GIS
3. **Berbagai Geometry**: Point, LineString, Polygon, MultiPoint, dll
4. **Rich Properties**: Dapat menyimpan atribut tambahan per feature
5. **Human Readable**: Format JSON yang mudah dibaca dan diedit

## 🔧 Format Data GOW ke GeoJSON:

```javascript
// Konversi data GOW ke GeoJSON
const convertToGeoJSON = (spatialDataArray) => {
  return {
    "type": "FeatureCollection",
    "features": spatialDataArray.map(item => ({
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [item.location.lng, item.location.lat] // GeoJSON: [lng, lat]
      },
      "properties": {
        "id": item.id,
        "name": item.name,
        "description": item.description,
        "created_at": item.created_at
      }
    }))
  };
};

// Konversi GeoJSON ke format GOW
const convertFromGeoJSON = (geojsonData) => {
  return geojsonData.features.map(feature => ({
    id: feature.properties.id,
    name: feature.properties.name,
    description: feature.properties.description,
    location: {
      lat: feature.geometry.coordinates[1], // GeoJSON: [lng, lat]
      lng: feature.geometry.coordinates[0]
    },
    created_at: feature.properties.created_at
  }));
};
```

## 📊 Contoh Real-World GeoJSON dengan Banyak Data:

1. **Boundary Data**: File berisi ratusan batas wilayah
2. **POI (Points of Interest)**: Ribuan titik lokasi bisnis
3. **Transportation**: Network jalan, stasiun, dan rute
4. **Environmental**: Data sensor, stasiun cuaca, dll

## 🚀 Implementasi untuk GOW:

Saya akan membuat fitur Import/Export GeoJSON yang dapat:
- Export semua data ke file GeoJSON
- Import multiple data dari file GeoJSON
- Validasi format GeoJSON
- Preview data sebelum import
