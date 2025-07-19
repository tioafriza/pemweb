<?php
include_once '../includes/cors.php';
header('Content-Type: application/json; charset=utf-8');
require_once '../models/KategoriModel.php';

$model = new KategoriModel();
$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true);

switch ($method) {
    case 'GET':
        $result = $model->readAll();
        http_response_code(200);
        echo json_encode($result);
        break;
    case 'POST':
        if (!isset($input['nama'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Field nama harus diisi']);
            break;
        }
        $result = $model->create(trim($input['nama']));
        http_response_code($result['success'] ? 201 : 500);
        echo json_encode($result);
        break;
    case 'PUT':
        if (!isset($input['id']) || !isset($input['nama'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Field id dan nama harus diisi']);
            break;
        }
        $result = $model->update(intval($input['id']), trim($input['nama']));
        http_response_code($result['success'] ? 200 : 404);
        echo json_encode($result);
        break;
    case 'DELETE':
        if (!isset($input['id'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Field id harus diisi']);
            break;
        }
        $result = $model->delete(intval($input['id']));
        http_response_code($result['success'] ? 200 : 404);
        echo json_encode($result);
        break;
    default:
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Method tidak diizinkan']);
        break;
}
