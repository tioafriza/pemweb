# Guide Presentasi Penjadwalan App

## 1. Pembukaan
- Perkenalan tim: Tio Afriza & Yalesvepa
- Judul: "Penjadwalan App - Studi Kasus Fullstack Docker"
- Tujuan: Menampilkan aplikasi penjadwalan modern dengan arsitektur terpisah dan deployment containerized

## 2. Demo Live
### a. Backend
- Tunjukkan endpoint utama di halaman backend/index.php
- Cek status health endpoint (`/api/health.php`)
- Lihat data jadwal, kategori, lokasi (GET)
- Tambah data baru via curl/Postman (POST)

### b. Frontend
- Tunjukkan UI React (tanpa perubahan UI dari desain awal)
- Lakukan interaksi CRUD dari frontend (tambah, edit, hapus jadwal)
- Pastikan data sinkron dengan backend

### c. Docker Compose
- Jelaskan arsitektur multi-container (backend, frontend, db, phpmyadmin)
- Tunjukkan file `docker-compose.yml` dan struktur folder
- Tunjukkan cara menjalankan seluruh stack dengan satu perintah

## 3. Penjelasan Teknis
- Skema database: tabel, relasi, seed data
- API endpoint: struktur, format request/response
- Penanganan CORS (masalah & solusi)
- Deployment & auto-init database
- Testing & debugging

## 4. Highlight & Inovasi
- Modular & scalable (tabel terpisah, API terstruktur, frontend SPA)
- Fix CORS Docker (studi kasus nyata)
- Integrasi fullstack seamless

## 5. Q&A
- Siapkan jawaban terkait:
  - Skema database & relasi
  - CORS & integrasi Docker
  - Pengembangan lebih lanjut (fitur tambahan, deployment cloud, dsb)

---

**Tips presentasi:**
- Gunakan live demo, bukan hanya slide statis
- Tunjukkan error handling dan solusi nyata (misal error CORS, error DB)
- Libatkan audiens: ajak mereka testing API via Postman/curl
- Sampaikan keunggulan desain dan kemudahan pengembangan lanjutan

---

**Copyright © 2025 Tio Afriza & Yalesvepa**
