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
