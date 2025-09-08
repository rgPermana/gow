
# Langkah-Langkah Membangun Website dengan Django + React.js + PostgreSQL (PostGIS) (Tanpa Docker)



## 1. Persiapan Lingkungan
1. **Instalasi Python dan pip**
    - Pastikan Python versi terbaru sudah terpasang. Untuk Fedora/Linux:
       ```bash
       sudo dnf install python3 python3-pip
       ```
    - Cek versi Python dan pip:
       ```bash
       python3 --version
       pip3 --version
       ```

2. **Instalasi virtualenv (opsional, jika ingin environment terpisah)**
    - Install virtualenv:
       ```bash
       pip3 install virtualenv
       ```

3. **Buat dan Aktifkan Virtual Environment**
    - Di folder proyek:
       ```bash
       python3 -m venv env
       source env/bin/activate
       ```
    - Jika menggunakan virtualenv:
       ```bash
       virtualenv env
       source env/bin/activate
       ```

4. **Install Dependensi Proyek**
    - Buat file `requirements.txt` sesuai kebutuhan (misal: django, psycopg2, dll).
    - Install semua dependensi:
       ```bash
       pip install -r requirements.txt
       ```

---


## 2. Konfigurasi Backend (Django)
1. **Konfigurasi Database di `settings.py`**:
   Tambahkan konfigurasi PostgreSQL:
   ```python
   DATABASES = {
      'default': {
         'ENGINE': 'django.contrib.gis.db.backends.postgis',
         'NAME': 'gow_pjsig',
         'USER': 'gow_db',
         'PASSWORD': 'dbadmin1234',
         'HOST': 'localhost',  # Ganti dengan 'localhost' jika tidak pakai Docker
         'PORT': '5432',
      }
   }
   ```

2. **Aktifkan GeoDjango**:
   Tambahkan `django.contrib.gis` ke `INSTALLED_APPS` di `settings.py`:
   ```python
   INSTALLED_APPS = [
       # ...existing apps...
       'django.contrib.gis',
   ]
   ```


3. **Setup PostgreSQL dan User Database**:
   **PENTING**: Sebelum menjalankan migrasi, pastikan PostgreSQL sudah running dan user database sudah dibuat.
   
   a. **Start dan Enable PostgreSQL**:
   ```bash
   sudo systemctl enable postgresql
   sudo postgresql-setup --initdb  # Jika belum diinisialisasi
   sudo systemctl start postgresql
   ```
   
   b. **Buat User dan Database**:
   ```bash
   sudo -u postgres psql -c "CREATE USER gow_db WITH PASSWORD 'dbadmin1234';"
   sudo -u postgres psql -c "CREATE DATABASE gow_pjsig OWNER gow_db;"
   sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE gow_pjsig TO gow_db;"
   sudo -u postgres psql -c "ALTER USER gow_db CREATEDB;"
   ```
   
   c. **Install dan Aktifkan PostGIS**:
   ```bash
   sudo dnf install postgis postgresql-contrib
   sudo systemctl restart postgresql
   sudo -u postgres psql -d gow_pjsig -c "CREATE EXTENSION IF NOT EXISTS postgis;"
   ```
   
   d. **Konfigurasi Authentication (jika perlu)**:
   Edit file `/var/lib/pgsql/data/pg_hba.conf` dan pastikan ada baris:
   ```
   host    all             all             127.0.0.1/32            md5
   host    all             all             ::1/128                 md5
   ```
   Restart PostgreSQL setelah perubahan:
   ```bash
   sudo systemctl restart postgresql
   ```

4. **Migrasi Database**:
   Jalankan perintah berikut di terminal (dalam virtual environment):
   ```bash
   source env/bin/activate  # Pastikan virtual environment aktif
   python manage.py makemigrations
   python manage.py migrate
   ```

5. **Jalankan Server Django**:
   ```bash
   python manage.py runserver
   ```
   Server akan berjalan di `http://127.0.0.1:8000/`
   
   **Catatan**: Warning "development server" yang muncul adalah normal dan aman untuk pengembangan. Warning ini hanya mengingatkan bahwa server ini tidak boleh digunakan di produksi. Untuk deployment produksi, gunakan server seperti Gunicorn atau uWSGI.

---

## 3. Konfigurasi Frontend (React.js)
1. **Buat Proyek React**:
   Di direktori utama:
   ```bash
   npx create-react-app frontend
   cd frontend
   ```

2. **Install Library untuk Peta**:
   ```bash
   npm install react-leaflet leaflet
   ```

3. **Struktur Direktori React**:
   - `src/components`: Untuk komponen UI.
   - `src/pages`: Untuk halaman utama.
   - `src/services`: Untuk API calls.

4. **Buat Komponen Peta**:
   Di `src/components/Map.js`:
   ```javascript
   import React from 'react';
   import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
   import 'leaflet/dist/leaflet.css';

   const Map = ({ data }) => {
       return (
           <MapContainer center={[0, 0]} zoom={2} style={{ height: '100vh', width: '100%' }}>
               <TileLayer
                   url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                   attribution="&copy; OpenStreetMap contributors"
               />
               {data.map((item, index) => (
                   <Marker key={index} position={[item.location.lat, item.location.lng]}>
                       <Popup>{item.name}</Popup>
                   </Marker>
               ))}
           </MapContainer>
       );
   };

   export default Map;
   ```

5. **Integrasi API**:
   Buat file `src/services/api.js`:
   ```javascript
   const API_URL = 'http://localhost:8000/api/spatial-data/';

   export const fetchSpatialData = async () => {
       const response = await fetch(API_URL);
       return response.json();
   };
   ```

6. **Tampilkan Data di Halaman Utama**:
   Di `src/pages/Home.js`:
   ```javascript
   import React, { useEffect, useState } from 'react';
   import Map from '../components/Map';
   import { fetchSpatialData } from '../services/api';

   const Home = () => {
       const [data, setData] = useState([]);

       useEffect(() => {
           fetchSpatialData().then(setData);
       }, []);

       return <Map data={data} />;
   };

   export default Home;
   ```

---


## 4. Integrasi Backend dan Frontend
1. **Konfigurasi CORS di Backend**:
    Install CORS headers:
    ```bash
    pip install django-cors-headers
    ```
    Tambahkan ke `INSTALLED_APPS` dan konfigurasi di `settings.py`:
    ```python
    INSTALLED_APPS += ['corsheaders']
    MIDDLEWARE = ['corsheaders.middleware.CorsMiddleware'] + MIDDLEWARE
    CORS_ALLOW_ALL_ORIGINS = True
    ```

2. **Jalankan Backend dan Frontend**:
    - Backend:
       ```bash
       python manage.py runserver
       ```
    - Frontend:
       ```bash
       npm start
       ```

---


## 5. Deployment
1. **Backend**:
   - Gunakan **Gunicorn** dan **Nginx** untuk deployment.
   - Gunakan **PostgreSQL** di server dengan ekstensi PostGIS.

2. **Frontend**:
   - Build aplikasi React:
     ```bash
     npm run build
     ```
   - Deploy ke server menggunakan **Nginx** atau layanan seperti **Vercel**.

3. **Dockerize** (Opsional):
   - Jika ingin menggunakan Docker, buat file `Dockerfile` untuk backend dan frontend.
   - Gunakan `docker-compose` untuk mengelola container.

---

## Troubleshooting PostgreSQL

### Error: "password authentication failed for user"
**Penyebab**: User database belum dibuat atau password tidak cocok.
**Solusi**:
1. Buat user dan database sesuai langkah 3 di atas
2. Pastikan password di `settings.py` sama dengan yang disetel di PostgreSQL

### Error: "connection refused" atau PostgreSQL tidak berjalan
**Penyebab**: PostgreSQL belum distart atau belum diinisialisasi.
**Solusi**:
```bash
sudo postgresql-setup --initdb
sudo systemctl enable postgresql
sudo systemctl start postgresql
```

### Error: "extension postgis is not available"
**Penyebab**: PostGIS belum terinstall.
**Solusi**:
```bash
sudo dnf install postgis postgresql-contrib
sudo systemctl restart postgresql
```

### Error: "ImportError: Couldn't import Django"
**Penyebab**: Virtual environment belum diaktifkan.
**Solusi**:
```bash
source env/bin/activate
```

### Warning: "This is a development server"
**Penyebab**: Django menampilkan warning standar saat menggunakan `runserver`.
**Penjelasan**: Warning ini normal untuk development dan tidak perlu diperbaiki. Server development tidak boleh digunakan di produksi.
**Untuk Produksi**: Gunakan server seperti Gunicorn:
```bash
pip install gunicorn
gunicorn backend.wsgi:application
```




catt: 
/home/rengga/00_GISBase_Fedora/gow/env/bin/python manage.py createsuperuser --username admin --email admin@example.com
Password: admin12345
Password (again): 
Superuser created successfully.
