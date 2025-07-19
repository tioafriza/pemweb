# Changelog

All notable changes to this project will be documented in this file.

## [2025-07-18]
### Changed
- **Backend**: Refactor total ke struktur database 3NF (jadwal, kategori, lokasi; foreign key, relasi, seed, index).
- **API**: Modularisasi endpoint (`jadwal.php`, `kategori.php`, `lokasi.php`) dengan dukungan CRUD penuh dan response konsisten.
- **Model**: Tambah model Kategori & Lokasi, refactor JadwalModel agar mendukung field baru dan join otomatis.
- **Dokumentasi**: index.php kini hanya menampilkan dokumentasi API, dashboard dan quick test dihapus.

### Added
- File `CHANGELOG.md` ini.
- Penjelasan endpoint di index.php.

### Removed
- Dashboard, sample data, dan quick test dari index.php.

---

## [Sebelumnya]
- Versi awal: API jadwal monolitik, satu tabel, tanpa relasi.
