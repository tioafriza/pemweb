-- Database untuk Penjadwalan App (3NF)
CREATE DATABASE IF NOT EXISTS penjadwalan_db;
USE penjadwalan_db;

-- Tabel kategori
CREATE TABLE IF NOT EXISTS kategori (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(100) NOT NULL UNIQUE
);

-- Tabel lokasi
CREATE TABLE IF NOT EXISTS lokasi (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(100) NOT NULL UNIQUE,
    alamat TEXT
);

-- Tabel jadwal (relasi ke kategori dan lokasi)
CREATE TABLE IF NOT EXISTS jadwal (
    id INT AUTO_INCREMENT PRIMARY KEY,
    kegiatan VARCHAR(255) NOT NULL,
    tanggal DATE NOT NULL,
    kategori_id INT,
    lokasi_id INT,
    deskripsi TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (kategori_id) REFERENCES kategori(id) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (lokasi_id) REFERENCES lokasi(id) ON DELETE SET NULL ON UPDATE CASCADE
);

-- Seed data kategori
INSERT INTO kategori (nama) VALUES
('Meeting'),
('Presentasi'),
('Deadline'),
('Review'),
('Testing'),
('Dokumentasi'),
('Demo'),
('Backup'),
('Evaluasi'),
('Submission');

-- Seed data lokasi
INSERT INTO lokasi (nama, alamat) VALUES
('Ruang Rapat 1', 'Lantai 2, Gedung A'),
('Online', 'Zoom/Google Meet'),
('Lab Komputer', 'Lantai 3, Gedung B'),
('Aula', 'Lantai 1, Gedung Utama');

-- Seed data jadwal
INSERT INTO jadwal (kegiatan, tanggal, kategori_id, lokasi_id, deskripsi) VALUES
('Rapat Tim Project', '2025-07-15', 1, 1, 'Diskusi awal project'),
('Presentasi UAS', '2025-07-20', 2, 4, 'Presentasi akhir semester'),
('Deadline Pengumpulan', '2025-07-25', 3, 2, 'Pengumpulan tugas akhir'),
('Review Code', '2025-07-16', 4, 2, 'Code review bersama'),
('Testing API', '2025-07-17', 5, 3, 'Uji API endpoint'),
('Dokumentasi Project', '2025-07-18', 6, 2, 'Update dokumentasi'),
('Persiapan Demo', '2025-07-19', 7, 4, 'Persiapan demo project'),
('Backup Data', '2025-07-21', 8, 2, 'Backup data ke server'),
('Evaluasi Project', '2025-07-22', 9, 1, 'Evaluasi hasil project'),
('Submission Final', '2025-07-26', 10, 2, 'Submit final project');

-- Index untuk optimasi query
CREATE INDEX idx_jadwal_tanggal ON jadwal(tanggal);
CREATE INDEX idx_jadwal_kategori ON jadwal(kategori_id);
CREATE INDEX idx_jadwal_lokasi ON jadwal(lokasi_id);

-- Cek struktur
DESCRIBE jadwal;
DESCRIBE kategori;
DESCRIBE lokasi;

-- Contoh query join
-- SELECT j.*, k.nama AS kategori, l.nama AS lokasi FROM jadwal j
-- LEFT JOIN kategori k ON j.kategori_id = k.id
-- LEFT JOIN lokasi l ON j.lokasi_id = l.id;
