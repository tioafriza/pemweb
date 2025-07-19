<?php
require_once __DIR__ . '/../config/database.php';

class JadwalModel {
    private $conn;
    private $table_name = "jadwal";

    public function __construct() {
        $database = new Database();
        $this->conn = $database->getConnection();
    }

    // Create - Tambah jadwal baru
    public function create($kegiatan, $tanggal, $kategori_id = null, $lokasi_id = null, $deskripsi = null) {
        try {
            $query = "INSERT INTO " . $this->table_name . " (kegiatan, tanggal, kategori_id, lokasi_id, deskripsi, created_at) VALUES (?, ?, ?, ?, ?, NOW())";
            $stmt = $this->conn->prepare($query);

            if ($stmt->execute([$kegiatan, $tanggal, $kategori_id, $lokasi_id, $deskripsi])) {
                return [
                    'success' => true,
                    'message' => 'Jadwal berhasil ditambahkan',
                    'id' => $this->conn->lastInsertId()
                ];
            }
            return [
                'success' => false,
                'message' => 'Gagal menambahkan jadwal'
            ];
        } catch (PDOException $e) {
            error_log("Create jadwal error: " . $e->getMessage());
            return [
                'success' => false,
                'message' => 'Error database: ' . $e->getMessage()
            ];
        }
    }

    // Read - Ambil semua jadwal
    public function readAll() {
        try {
            $query = "SELECT j.*, k.nama AS kategori, l.nama AS lokasi, l.alamat AS lokasi_alamat FROM " . $this->table_name . " j
                LEFT JOIN kategori k ON j.kategori_id = k.id
                LEFT JOIN lokasi l ON j.lokasi_id = l.id
                ORDER BY j.tanggal ASC";
            $stmt = $this->conn->prepare($query);
            $stmt->execute();

            $jadwal_arr = [];
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $jadwal_arr[] = [
                    'id' => $row['id'],
                    'kegiatan' => $row['kegiatan'],
                    'tanggal' => $row['tanggal'],
                    'kategori_id' => $row['kategori_id'],
                    'kategori' => $row['kategori'],
                    'lokasi_id' => $row['lokasi_id'],
                    'lokasi' => $row['lokasi'],
                    'lokasi_alamat' => $row['lokasi_alamat'],
                    'deskripsi' => $row['deskripsi'],
                    'created_at' => $row['created_at'],
                    'updated_at' => $row['updated_at']
                ];
            }

            return [
                'success' => true,
                'data' => $jadwal_arr,
                'total' => count($jadwal_arr)
            ];
        } catch (PDOException $e) {
            error_log("Read all jadwal error: " . $e->getMessage());
            return [
                'success' => false,
                'message' => 'Error database: ' . $e->getMessage(),
                'data' => [],
                'total' => 0
            ];
        }
    }

    // Read - Ambil jadwal berdasarkan ID
    public function readById($id) {
        $query = "SELECT j.*, k.nama AS kategori, l.nama AS lokasi, l.alamat AS lokasi_alamat FROM " . $this->table_name . " j
            LEFT JOIN kategori k ON j.kategori_id = k.id
            LEFT JOIN lokasi l ON j.lokasi_id = l.id
            WHERE j.id = ? LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([$id]);

        if ($stmt->rowCount() > 0) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            return [
                'success' => true,
                'data' => [
                    'id' => $row['id'],
                    'kegiatan' => $row['kegiatan'],
                    'tanggal' => $row['tanggal'],
                    'kategori_id' => $row['kategori_id'],
                    'kategori' => $row['kategori'],
                    'lokasi_id' => $row['lokasi_id'],
                    'lokasi' => $row['lokasi'],
                    'lokasi_alamat' => $row['lokasi_alamat'],
                    'deskripsi' => $row['deskripsi'],
                    'created_at' => $row['created_at'],
                    'updated_at' => $row['updated_at']
                ]
            ];
        }

        return [
            'success' => false,
            'message' => 'Jadwal tidak ditemukan'
        ];
    }

    // Update - Perbarui jadwal
    public function update($id, $kegiatan, $tanggal, $kategori_id = null, $lokasi_id = null, $deskripsi = null) {
        try {
            $query = "UPDATE " . $this->table_name . " SET kegiatan = ?, tanggal = ?, kategori_id = ?, lokasi_id = ?, deskripsi = ?, updated_at = NOW() WHERE id = ?";
            $stmt = $this->conn->prepare($query);

            if ($stmt->execute([$kegiatan, $tanggal, $kategori_id, $lokasi_id, $deskripsi, $id])) {
                if ($stmt->rowCount() > 0) {
                    return [
                        'success' => true,
                        'message' => 'Jadwal berhasil diperbarui'
                    ];
                }
                return [
                    'success' => false,
                    'message' => 'Jadwal tidak ditemukan'
                ];
            }
            return [
                'success' => false,
                'message' => 'Gagal memperbarui jadwal'
            ];
        } catch (PDOException $e) {
            error_log("Update jadwal error: " . $e->getMessage());
            return [
                'success' => false,
                'message' => 'Error database: ' . $e->getMessage()
            ];
        }
    }

    // Delete - Hapus jadwal
    public function delete($id) {
        try {
            $query = "DELETE FROM " . $this->table_name . " WHERE id = ?";
            $stmt = $this->conn->prepare($query);

            if ($stmt->execute([$id])) {
                if ($stmt->rowCount() > 0) {
                    return [
                        'success' => true,
                        'message' => 'Jadwal berhasil dihapus'
                    ];
                }
                return [
                    'success' => false,
                    'message' => 'Jadwal tidak ditemukan'
                ];
            }
            return [
                'success' => false,
                'message' => 'Gagal menghapus jadwal'
            ];
        } catch (PDOException $e) {
            error_log("Delete jadwal error: " . $e->getMessage());
            return [
                'success' => false,
                'message' => 'Error database: ' . $e->getMessage()
            ];
        }
    }

    // Get total count
    public function getCount() {
        try {
            $query = "SELECT COUNT(*) as total FROM " . $this->table_name;
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            return $row['total'];
        } catch (PDOException $e) {
            error_log("Get count error: " . $e->getMessage());
            return 0;
        }
    }

    // Health check - Test database connection
    public function healthCheck() {
        try {
            $query = "SELECT 1";
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            return [
                'success' => true,
                'message' => 'Database connection is healthy',
                'timestamp' => date('Y-m-d H:i:s')
            ];
        } catch (PDOException $e) {
            error_log("Health check error: " . $e->getMessage());
            return [
                'success' => false,
                'message' => 'Database connection failed: ' . $e->getMessage(),
                'timestamp' => date('Y-m-d H:i:s')
            ];
        }
    }
}
?>