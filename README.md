# Penjadwalan App - Dokumentasi

**Web dibuat oleh: Tio Afriza dan Yales Vepa**

---

## Flowchart Arsitektur

```mermaid
flowchart TD
    A[User Akses Frontend (React/Nginx)] -->|Request API| B[Backend (PHP/Apache)]
    B -->|Query| C[(MySQL Database)]
    B -->|Response JSON| A
    A -->|Tampilkan Data| D[UI Jadwal/Kategori/Lokasi]
    D -->|Aksi CRUD| A
    
    subgraph Docker Compose
        B
        C
        A
    end
```

---

## Daftar Isi
- [Penjadwalan App - Dokumentasi](#penjadwalan-app---dokumentasi)
  - [Flowchart Arsitektur](#flowchart-arsitektur)
  - [Daftar Isi](#daftar-isi)
  - [Deskripsi Singkat](#deskripsi-singkat)
  - [Teknologi yang Digunakan](#teknologi-yang-digunakan)
  - [Struktur Database \& Tabel](#struktur-database--tabel)
    - [1. kategori](#1-kategori)
    - [2. lokasi](#2-lokasi)
    - [3. jadwal](#3-jadwal)
  - [Penjelasan Endpoint API](#penjelasan-endpoint-api)
    - [Contoh Request](#contoh-request)
  - [Struktur Docker \& Deployment](#struktur-docker--deployment)
  - [Panduan Penggunaan](#panduan-penggunaan)
  - [Modul Pembelajaran](#modul-pembelajaran)
  - [Guide Presentasi](#guide-presentasi)

---

## Deskripsi Singkat
Aplikasi penjadwalan event/kegiatan berbasis web dengan backend PHP native (tanpa framework) dan frontend React. Mendukung manajemen jadwal, kategori, dan lokasi secara terpisah. Integrasi penuh via Docker Compose.

---

## Teknologi yang Digunakan
- **Backend:** PHP Native (tanpa framework), Apache2
- **Frontend:** ReactJS (SPA), Nginx
- **Database:** MySQL 8
- **Orkestrasi:** Docker Compose
- **Testing:** Postman, curl, Thunder Client
- **Lainnya:** phpMyAdmin (opsional)

---

## Struktur Database & Tabel

### 1. kategori
| Field       | Tipe         | Keterangan          |
|-------------|--------------|---------------------|
| id          | INT, PK, AI  | Primary Key         |
| nama        | VARCHAR(100) | Unik, wajib         |

### 2. lokasi
| Field       | Tipe         | Keterangan          |
|-------------|--------------|---------------------|
| id          | INT, PK, AI  | Primary Key         |
| nama        | VARCHAR(100) | Unik, wajib         |
| alamat      | TEXT         | Opsional            |

### 3. jadwal
| Field       | Tipe         | Keterangan          |
|-------------|--------------|---------------------|
| id          | INT, PK, AI  | Primary Key         |
| kegiatan    | VARCHAR(255) | Nama kegiatan       |
| tanggal     | DATE         | Tanggal (YYYY-MM-DD)|
| kategori_id | INT, FK      | Relasi ke kategori  |
| lokasi_id   | INT, FK      | Relasi ke lokasi    |
| deskripsi   | TEXT         | Opsional            |
| created_at  | TIMESTAMP    | Otomatis            |
| updated_at  | TIMESTAMP    | Otomatis            |

---

## Penjelasan Endpoint API
Semua endpoint menerima dan mengembalikan data dalam format JSON.

| Endpoint              | Method | Deskripsi                        |
|-----------------------|--------|----------------------------------|
| `/api/jadwal.php`     | GET    | List semua jadwal                |
| `/api/jadwal.php`     | POST   | Tambah jadwal baru               |
| `/api/jadwal.php`     | PUT    | Update jadwal                    |
| `/api/jadwal.php`     | DELETE | Hapus jadwal                     |
| `/api/kategori.php`   | GET    | List semua kategori              |
| `/api/lokasi.php`     | GET    | List semua lokasi                |
| `/api/health.php`     | GET    | Cek status server & database     |

### Contoh Request
```bash
# GET semua jadwal
curl http://localhost:8080/api/jadwal.php

# POST jadwal baru
curl -X POST http://localhost:8080/api/jadwal.php -H "Content-Type: application/json" -d '{"kegiatan":"Tes","tanggal":"2025-07-25"}'
```

---

## Struktur Docker & Deployment
- Semua service (backend, frontend, database, phpmyadmin) dikelola via `docker-compose.yml`.
- Database otomatis inisialisasi dari `backend/database.sql` saat volume masih kosong.
- Frontend React di-serve oleh Nginx (port 3000), backend PHP di-serve oleh Apache (port 8080).
- Konfigurasi CORS dihandle global oleh Apache.

---

## Panduan Penggunaan
1. **Clone repo & masuk ke folder project**
2. **Jalankan:**
   ```bash
   docker-compose up -d
   ```
3. **Akses:**
   - Backend API: [http://localhost:8080](http://localhost:8080)
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - phpMyAdmin: [http://localhost:8081](http://localhost:8081) (opsional)
4. **Testing API:**
   - Gunakan Postman/curl/Thunder Client
   - Lihat contoh di halaman backend/index.php

---

## Modul Pembelajaran
1. **Konsep CRUD API** (Create, Read, Update, Delete) dengan PHP Native
2. **Relasi antar tabel (FK)** di MySQL
3. **Integrasi Docker Compose** untuk fullstack development
4. **Handling CORS** secara benar di environment Docker
5. **Testing API dengan curl/Postman**
6. **Single Page Application (SPA) dengan React**

---

## Guide Presentasi
- **Judul:** Penjadwalan App - Studi Kasus Fullstack Docker
- **Tim:** Tio Afriza & Yalesvepa
- **Demo:**
  - Tunjukkan backend (API, health, endpoint, database)
  - Tunjukkan frontend (tampilan, interaksi CRUD)
  - Tunjukkan Docker Compose (`docker-compose.yml`, arsitektur)
- **Highlight:**
  - CORS fix, integrasi multi-container, auto-init database
  - Kelebihan desain modular (tabel terpisah, API terstruktur, frontend modern)
- **Q&A:** Siapkan penjelasan tentang skema database, CORS, dan deployment

---

**Copyright © 2025 Tio Afriza & Yales Vepa**
