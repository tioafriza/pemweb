<?php
require_once __DIR__ . '/../config/database.php';

class LokasiModel {
    private $conn;
    private $table_name = "lokasi";

    public function __construct() {
        $database = new Database();
        $this->conn = $database->getConnection();
    }

    public function readAll() {
        try {
            $query = "SELECT * FROM $this->table_name ORDER BY nama ASC";
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
            return [
                'success' => true,
                'data' => $result
            ];
        } catch (PDOException $e) {
            return [
                'success' => false,
                'message' => $e->getMessage(),
                'data' => []
            ];
        }
    }

    public function create($nama, $alamat) {
        try {
            $query = "INSERT INTO $this->table_name (nama, alamat) VALUES (?, ?)";
            $stmt = $this->conn->prepare($query);
            if ($stmt->execute([$nama, $alamat])) {
                return [
                    'success' => true,
                    'id' => $this->conn->lastInsertId()
                ];
            }
            return [
                'success' => false
            ];
        } catch (PDOException $e) {
            return [
                'success' => false,
                'message' => $e->getMessage()
            ];
        }
    }

    public function update($id, $nama, $alamat) {
        try {
            $query = "UPDATE $this->table_name SET nama = ?, alamat = ? WHERE id = ?";
            $stmt = $this->conn->prepare($query);
            if ($stmt->execute([$nama, $alamat, $id])) {
                return [
                    'success' => $stmt->rowCount() > 0
                ];
            }
            return [
                'success' => false
            ];
        } catch (PDOException $e) {
            return [
                'success' => false,
                'message' => $e->getMessage()
            ];
        }
    }

    public function delete($id) {
        try {
            $query = "DELETE FROM $this->table_name WHERE id = ?";
            $stmt = $this->conn->prepare($query);
            if ($stmt->execute([$id])) {
                return [
                    'success' => $stmt->rowCount() > 0
                ];
            }
            return [
                'success' => false
            ];
        } catch (PDOException $e) {
            return [
                'success' => false,
                'message' => $e->getMessage()
            ];
        }
    }
}
