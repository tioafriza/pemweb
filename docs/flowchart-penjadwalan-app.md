# Flowchart Penjadwalan App

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

**Penjelasan:**
- User mengakses aplikasi via frontend React yang di-serve oleh Nginx (port 3000)
- Semua interaksi data (CRUD jadwal, kategori, lokasi) dilakukan lewat API ke backend PHP (port 8080)
- Backend PHP melakukan query ke MySQL database
- Semua service berjalan terisolasi dan terhubung via Docker Compose network
- phpMyAdmin bisa digunakan untuk mengelola database secara visual (opsional)

---

> Flowchart ini dapat di-copy ke [Mermaid Live Editor](https://mermaid.live/) untuk visualisasi otomatis.
