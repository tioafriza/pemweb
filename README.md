<<<<<<< HEAD
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
=======
# Dokumentasi Project Penjadwalan-App

## Tujuan Project

Aplikasi ini membantu pengguna mengelola dan menjadwalkan aktivitas secara efisien melalui antarmuka web interaktif berbasis React.

## Fitur Utama

- **Dashboard**: Menampilkan ringkasan jumlah kegiatan, jumlah kegiatan di hari libur nasional (menggunakan API eksternal), dan tabel ringkasan jadwal.

  Contoh kode utama:

  ```jsx
  // src/pages/Dashboard.js
  import React, { useEffect, useState } from "react";
  import axios from "axios";
  function Dashboard() {
    const [jadwal, setJadwal] = useState([]);
    const [liburDates, setLiburDates] = useState([]);
    useEffect(() => {
      // Ambil jadwal dari localStorage
      const data = localStorage.getItem("jadwalList");
      if (data) {
        setJadwal(JSON.parse(data));
      }
      // Ambil data libur nasional
      axios.get("https://api-harilibur.vercel.app/api").then((res) => {
        const dates = res.data.map((item) => item.holiday_date);
        setLiburDates(dates);
      });
    }, []);
    const totalKegiatan = jadwal.length;
    const totalHariLibur = jadwal.filter((j) =>
      liburDates.includes(j.tanggal)
    ).length;
    // ...rendering komponen
  }
  ```

- **Manajemen Jadwal**: Tambah, edit, hapus, dan lihat daftar jadwal. Data tersimpan di localStorage. Terdapat deteksi otomatis apakah tanggal kegiatan bertepatan dengan hari libur nasional (API harilibur).

  Contoh kode utama:

  ```jsx
  // src/pages/Jadwal.js
  import React, { useState, useEffect } from "react";
  import axios from "axios";
  function Jadwal() {
    const [jadwalList, setJadwalList] = useState([]);
    const [kegiatan, setKegiatan] = useState("");
    const [tanggal, setTanggal] = useState("");
    const [isLibur, setIsLibur] = useState(false);
    const [editIndex, setEditIndex] = useState(null);
    useEffect(() => {
      const savedJadwal = localStorage.getItem("jadwalList");
      if (savedJadwal) {
        setJadwalList(JSON.parse(savedJadwal));
      }
    }, []);
    useEffect(() => {
      localStorage.setItem("jadwalList", JSON.stringify(jadwalList));
    }, [jadwalList]);
    useEffect(() => {
      if (tanggal) {
        axios.get("https://api-harilibur.vercel.app/api").then((res) => {
          const libur = res.data.some((item) => item.holiday_date === tanggal);
          setIsLibur(libur);
        });
      }
    }, [tanggal]);
    // ...fungsi tambah, edit, hapus, dan rendering komponen
  }
  ```

- **Navigasi Mudah**: Navbar untuk akses cepat ke Home, Dashboard, Jadwal, About, dan Contact.
- **Halaman Informasi**: About (tentang aplikasi dan tim), Contact (formulir pesan, data tersimpan di localStorage).

  Contoh kode penyimpanan pesan kontak:

  ```jsx
  // src/pages/Contact.js
  function Contact() {
    const [formData, setFormData] = useState({
      nama: "",
      email: "",
      pesan: "",
    });
    const handleChange = (e) =>
      setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleSubmit = (e) => {
      e.preventDefault();
      const existingMessages =
        JSON.parse(localStorage.getItem("contactMessages")) || [];
      const updatedMessages = [...existingMessages, formData];
      localStorage.setItem("contactMessages", JSON.stringify(updatedMessages));
      alert("Pesan terkirim!");
      setFormData({ nama: "", email: "", pesan: "" });
    };
    // ...rendering form
  }
  ```

- **Styling Responsive**: Tampilan konsisten dan modern dengan CSS custom.

## Struktur Folder Project

```
penjadwalan-app/
├── public/           # Berkas statis (favicon, index.html, logo, manifest, robots)
├── src/
│   ├── components/
│   │   └── Navbar.js # Komponen navigasi utama
│   ├── pages/
│   │   ├── Home.js      # Halaman utama
│   │   ├── Dashboard.js # Ringkasan jadwal & statistik
│   │   ├── Jadwal.js    # CRUD jadwal
│   │   ├── About.js     # Tentang aplikasi
│   │   └── Contact.js   # Formulir kontak
│   ├── styles/
│   │   └── index.css    # Styling global
│   ├── App.js           # Root komponen React (routing)
│   ├── App.css          # Styling tambahan bawaan React
│   ├── App.test.js      # Unit test bawaan
│   ├── index.js         # Entry point aplikasi
│   ├── logo.svg         # Logo React
│   ├── reportWebVitals.js # Monitoring performa
│   └── setupTests.js    # Setup testing
├── package.json         # Konfigurasi & dependensi
├── package-lock.json    # Lockfile npm
├── README.md            # Dokumentasi teknis default
└── PRESENTASI.md        # Dokumentasi & pedoman presentasi (file ini)
```

## Penjelasan Halaman & Fungsi Penting

- **src/App.js**
  - Mengatur routing utama aplikasi menggunakan react-router-dom.
  - Menampilkan Navbar di semua halaman.
  - Routing ke Home, About, Jadwal, Contact, Dashboard.
- **src/components/Navbar.js**
  - Navigasi utama, akses ke semua halaman.
- **src/pages/Home.js**
  - Halaman sambutan dan penjelasan singkat aplikasi.
- **src/pages/Dashboard.js**
  - Mengambil data jadwal dari localStorage.
  - Mengambil data hari libur nasional dari API eksternal.
  - Menampilkan total kegiatan, jumlah kegiatan di hari libur, dan tabel ringkasan jadwal.
- **src/pages/Jadwal.js**
  - CRUD jadwal: tambah, edit, hapus, lihat daftar.
  - Data jadwal tersimpan di localStorage.
  - Deteksi otomatis apakah tanggal kegiatan adalah hari libur nasional (API harilibur).
- **src/pages/About.js**
  - Informasi tentang aplikasi dan tim pengembang.
- **src/pages/Contact.js**
  - Formulir kontak (nama, email, pesan), data pesan disimpan di localStorage.
- **src/styles/index.css**
  - Styling global: layout responsif, styling navbar, form, dan tabel.
- **src/App.css**
  - Styling tambahan bawaan React (tidak wajib diubah).
- **src/App.test.js, setupTests.js, reportWebVitals.js**
  - Berkas pendukung testing dan monitoring performa (bawaan Create React App).

## Dependensi Utama (Sesuai package.json)

- **react**: Library utama UI.
- **react-dom**: Rendering React ke DOM.
- **react-router-dom**: Routing antar halaman.
- **axios**: HTTP client untuk fetch API hari libur nasional.
- **react-scripts**: Scripts bawaan Create React App.

## Cara Menjalankan Project

1. **Install Dependensi**
   ```
   npm install
   ```
2. **Jalankan Development Server**
   ```
   npm start
   ```
3. **Akses Aplikasi**
   Buka browser dan kunjungi [http://localhost:3000](http://localhost:3000)
>>>>>>> 2d45e42892736bb1a0f2b6397284d5e6d0e306ca
