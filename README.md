# GOW (GIS on Web) 🌍

**Geographic Information System berbasis Web dengan Django & React.js**

GOW adalah aplikasi GIS (Geographic Information System) modern yang dibangun untuk menyediakan platform manajemen data spasial yang mudah digunakan melalui web browser. Aplikasi ini menggabungkan kekuatan backend Django dengan GeoDjango dan frontend React.js untuk menciptakan pengalaman pengguna yang interaktif dan responsif.

![GOW Banner](https://img.shields.io/badge/GIS-on%20Web-blue?style=for-the-badge&logo=globe)

## 🎯 Tujuan Proyek

GOW dikembangkan dengan tujuan untuk:

- **Modernisasi GIS**: Membawa teknologi GIS ke platform web yang dapat diakses dari mana saja
- **Kemudahan Akses**: Menyediakan antarmuka yang intuitif untuk manajemen data spasial
- **Skalabilitas**: Membangun arsitektur yang dapat berkembang sesuai kebutuhan
- **Open Source**: Memberikan solusi GIS yang terbuka dan dapat dikustomisasi
- **Edukasi**: Menjadi referensi implementasi GIS modern dengan teknologi terkini

## ✨ Fitur Utama

### 🗺️ **Manajemen Data Spasial**
- **CRUD Operations**: Create, Read, Update, Delete data geografis
- **Interactive Mapping**: Peta interaktif dengan Leaflet.js
- **Point Management**: Manajemen titik koordinat dengan presisi tinggi
- **Map-based Input**: Input data langsung melalui klik pada peta

### 📊 **Antarmuka Pengguna**
- **Sidebar Navigation**: Panel navigasi dengan tabs untuk Data, Tools, dan Layers
- **Responsive Design**: Optimal di desktop, tablet, dan mobile
- **Real-time Updates**: Sinkronisasi data real-time
- **Search & Filter**: Pencarian dan filter data yang powerful

### 🛠️ **Tools GIS**
- **Coordinate Display**: Tampilan koordinat dengan format yang mudah dibaca
- **Data Visualization**: Visualisasi data dengan marker dan popup interaktif
- **Export/Import**: (Roadmap) Kemampuan ekspor/impor berbagai format GIS

## 🏗️ Arsitektur Teknologi

### **Backend Stack**
```
🐍 Django 5.2.6          - Web framework utama
🌍 GeoDjango             - Ekstensi GIS untuk Django
🗄️ PostgreSQL + PostGIS  - Database spasial
🔗 Django CORS Headers   - Cross-origin resource sharing
🌐 Django REST Framework - API development
```

### **Frontend Stack**
```
⚛️ React.js 18           - UI framework
🗺️ Leaflet.js            - Interactive mapping library
🎨 Font Awesome 6        - Icon library
📱 CSS3 + Flexbox       - Responsive styling
🔄 Fetch API             - HTTP client
```

### **Development Tools**
```
🐙 Git                   - Version control
📦 npm                   - Package manager
🐳 Virtual Environment   - Python dependency isolation
🔧 VS Code               - Development environment
```

## 📋 Persyaratan Sistem

### **Minimum Requirements**
- **OS**: Linux/Windows/macOS
- **Python**: 3.8+
- **Node.js**: 14+
- **PostgreSQL**: 12+
- **PostGIS**: 3.0+

### **Recommended**
- **RAM**: 4GB+
- **Storage**: 2GB free space
- **Browser**: Chrome 80+, Firefox 75+, Safari 13+

## 🚀 Instalasi & Setup

### **1. Clone Repository**
```bash
git clone https://github.com/rgPermana/gow.git
cd gow
```

### **2. Backend Setup (Django)**
```bash
# Buat virtual environment
python -m venv env
source env/bin/activate  # Linux/macOS
# atau env\Scripts\activate  # Windows

# Install dependencies
pip install -r requirements.txt

# Setup database
python manage.py makemigrations
python manage.py migrate

# Jalankan development server
python manage.py runserver
```

### **3. Frontend Setup (React)**
```bash
# Pindah ke direktori frontend
cd frontend

# Install dependencies
npm install

# Jalankan development server
npm start
```

### **4. Database Configuration**
```python
# settings.py
DATABASES = {
    'default': {
        'ENGINE': 'django.contrib.gis.db.backends.postgis',
        'NAME': 'gow_db',
        'USER': 'your_username',
        'PASSWORD': 'your_password',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

## 📁 Struktur Proyek

```
gow/
├── backend/                 # Django backend configuration
├── gisapp/                 # Django GIS application
│   ├── models.py           # Data models (SpatialData)
│   ├── views.py            # API endpoints
│   ├── urls.py             # URL routing
│   └── migrations/         # Database migrations
├── frontend/               # React frontend
│   ├── public/             # Static files
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── Map.js      # Interactive map component
│   │   │   ├── Sidebar.js  # Navigation sidebar
│   │   │   ├── DataForm.js # Data input form
│   │   │   └── *.css       # Component styles
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   └── App.js          # Main application
├── env/                    # Python virtual environment
├── manage.py               # Django management script
└── requirements.txt        # Python dependencies
```

## 🎮 Cara Penggunaan

### **1. Menambah Data Spasial**
- Klik tombol "Add via Map" di toolbar
- Klik pada peta untuk memilih lokasi
- Isi form dengan nama dan deskripsi
- Klik "Save" untuk menyimpan

### **2. Mengedit Data**
- Klik marker di peta atau item di sidebar
- Klik tombol "Edit" pada popup atau sidebar
- Modifikasi data yang diperlukan
- Simpan perubahan

### **3. Navigasi Sidebar**
- **Data Tab**: Lihat dan kelola semua data spasial
- **Tools Tab**: Akses tools GIS (dalam development)
- **Layers Tab**: Kontrol layer peta

### **4. Pencarian Data**
- Gunakan search box di sidebar
- Filter berdasarkan nama atau deskripsi
- Klik item untuk zoom ke lokasi

## 🔧 API Endpoints

### **Spatial Data API**
```
GET    /api/spatial-data/     - Ambil semua data
POST   /api/spatial-data/     - Buat data baru
GET    /api/spatial-data/{id}/ - Ambil data spesifik
PUT    /api/spatial-data/{id}/ - Update data
DELETE /api/spatial-data/{id}/ - Hapus data
```

### **Request/Response Format**
```json
{
  "id": 1,
  "name": "Jakarta",
  "description": "Ibu kota Indonesia",
  "location": {
    "lat": -6.2088,
    "lng": 106.8451
  },
  "created_at": "2025-01-01T00:00:00Z"
}
```

## 🛣️ Roadmap

### **v1.1 - Enhanced GIS Tools**
- [ ] Measurement tools (distance, area)
- [ ] Buffer analysis
- [ ] Nearest neighbor analysis

### **v1.2 - Data Management**
- [ ] Import/Export (GeoJSON, KML, Shapefile)
- [ ] Batch operations
- [ ] Data validation

### **v1.3 - Advanced Features**
- [ ] User authentication & authorization
- [ ] Multi-layer support
- [ ] Custom map styles
- [ ] Real-time collaboration

### **v2.0 - Enterprise Features**
- [ ] Raster data support
- [ ] Advanced spatial queries
- [ ] RESTful API documentation
- [ ] Performance optimization

## 🤝 Kontribusi

Kami menyambut kontribusi dari komunitas! Berikut cara berkontribusi:

1. **Fork** repository ini
2. **Buat branch** fitur (`git checkout -b feature/AmazingFeature`)
3. **Commit** perubahan (`git commit -m 'Add some AmazingFeature'`)
4. **Push** ke branch (`git push origin feature/AmazingFeature`)
5. **Buat Pull Request**

### **Guidelines**
- Ikuti style guide yang ada
- Tulis unit tests untuk fitur baru
- Update dokumentasi jika diperlukan
- Gunakan commit message yang deskriptif

## 📄 Lisensi

Proyek ini dilisensikan di bawah [MIT License](LICENSE) - lihat file LICENSE untuk detail.

## 👥 Tim Developer

- **[rgPermana](https://github.com/rgPermana)** - *Full Stack Developer & Project Maintainer*

## 🙏 Acknowledgments

- **Django Team** - Framework web yang powerful
- **React Team** - Library UI yang modern
- **Leaflet** - Library peta open source terbaik
- **PostGIS** - Ekstensi spatial database yang luar biasa
- **Open Source Community** - Inspirasi dan dukungan

## 📞 Kontak & Support

- **GitHub Issues**: [Report Bug atau Request Feature](https://github.com/rgPermana/gow/issues)
- **Email**: [your-email@example.com]
- **Website**: [https://your-website.com]

---

<div align="center">

**🌍 GOW - Bringing GIS to the Web 🌍**

[![GitHub stars](https://img.shields.io/github/stars/rgPermana/gow?style=social)](https://github.com/rgPermana/gow/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/rgPermana/gow?style=social)](https://github.com/rgPermana/gow/network)
[![GitHub issues](https://img.shields.io/github/issues/rgPermana/gow)](https://github.com/rgPermana/gow/issues)

**Dibuat dengan ❤️ untuk komunitas GIS Indonesia**

</div>
