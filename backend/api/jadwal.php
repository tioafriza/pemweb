<?php
// Set CORS headers
include_once '../includes/cors.php';
require_once '../models/JadwalModel.php';

$jadwalModel = new JadwalModel();
$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true);

switch ($method) {
    case 'GET':
        if (isset($_GET['id'])) {
            // Get specific jadwal by ID
            $id = intval($_GET['id']);
            $result = $jadwalModel->readById($id);
            http_response_code($result['success'] ? 200 : 404);
            echo json_encode($result);
        } else {
            // Get all jadwal
            $result = $jadwalModel->readAll();
            http_response_code(200);
            echo json_encode($result);
        }
        break;

    case 'POST':
        // Create new jadwal
        if (!isset($input['kegiatan']) || !isset($input['tanggal'])) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'Field kegiatan dan tanggal harus diisi'
            ]);
            break;
        }

        $kegiatan = trim($input['kegiatan']);
        $tanggal = trim($input['tanggal']);
        $kategori_id = isset($input['kategori_id']) ? intval($input['kategori_id']) : null;
        $lokasi_id = isset($input['lokasi_id']) ? intval($input['lokasi_id']) : null;
        $deskripsi = isset($input['deskripsi']) ? trim($input['deskripsi']) : null;

        if (empty($kegiatan) || empty($tanggal)) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'Kegiatan dan tanggal tidak boleh kosong'
            ]);
            break;
        }

        // Validate date format
        if (!DateTime::createFromFormat('Y-m-d', $tanggal)) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'Format tanggal harus YYYY-MM-DD'
            ]);
            break;
        }

        $result = $jadwalModel->create($kegiatan, $tanggal, $kategori_id, $lokasi_id, $deskripsi);
        http_response_code($result['success'] ? 201 : 500);
        echo json_encode($result);
        break;

    case 'PUT':
        // Update existing jadwal
        if (!isset($input['id']) || !isset($input['kegiatan']) || !isset($input['tanggal'])) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'Field id, kegiatan, dan tanggal harus diisi'
            ]);
            break;
        }

        $id = intval($input['id']);
        $kegiatan = trim($input['kegiatan']);
        $tanggal = trim($input['tanggal']);
        $kategori_id = isset($input['kategori_id']) ? intval($input['kategori_id']) : null;
        $lokasi_id = isset($input['lokasi_id']) ? intval($input['lokasi_id']) : null;
        $deskripsi = isset($input['deskripsi']) ? trim($input['deskripsi']) : null;

        if (empty($kegiatan) || empty($tanggal)) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'Kegiatan dan tanggal tidak boleh kosong'
            ]);
            break;
        }

        // Validate date format
        if (!DateTime::createFromFormat('Y-m-d', $tanggal)) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'Format tanggal harus YYYY-MM-DD'
            ]);
            break;
        }

        $result = $jadwalModel->update($id, $kegiatan, $tanggal, $kategori_id, $lokasi_id, $deskripsi);
        http_response_code($result['success'] ? 200 : 404);
        echo json_encode($result);
        break;

    case 'DELETE':
        // Delete jadwal
        if (!isset($input['id'])) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'Field id harus diisi'
            ]);
            break;
        }

        $id = intval($input['id']);
        $result = $jadwalModel->delete($id);

        if ($result['success']) {
            http_response_code(200);
        } else {
            http_response_code(404);
        }
        echo json_encode($result);
        break;

    default:
        http_response_code(405);
        echo json_encode([
            'success' => false,
            'message' => 'Method tidak diizinkan'
        ]);
        break;
}
?>