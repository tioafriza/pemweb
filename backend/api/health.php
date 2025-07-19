<?php
include_once '../includes/cors.php';
header('Content-Type: application/json; charset=utf-8');

require_once '../models/JadwalModel.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    try {
        $jadwalModel = new JadwalModel();
        $healthCheck = $jadwalModel->healthCheck();

        // Check required tables
        $requiredTables = ['jadwal', 'kategori', 'lokasi'];
        $missingTables = [];
        try {
            $pdo = $jadwalModel->getPdo();
            $stmt = $pdo->query("SHOW TABLES");
            $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
            foreach ($requiredTables as $tbl) {
                if (!in_array($tbl, $tables)) {
                    $missingTables[] = $tbl;
                }
            }
        } catch (Exception $e) {
            $missingTables = $requiredTables;
        }

        // Additional system checks
        $systemInfo = [
            'php_version' => phpversion(),
            'server_time' => date('Y-m-d H:i:s'),
            'memory_usage' => memory_get_usage(true),
            'memory_limit' => ini_get('memory_limit'),
            'missing_tables' => $missingTables
        ];

        $response = [
            'success' => $healthCheck['success'] && empty($missingTables),
            'message' => empty($missingTables) ? $healthCheck['message'] : ('Missing tables: ' . implode(', ', $missingTables)),
            'timestamp' => $healthCheck['timestamp'],
            'system' => $systemInfo,
            'endpoints' => [
                'jadwal' => '/api/jadwal.php',
                'health' => '/api/health.php',
                'kategori' => '/api/kategori.php',
                'lokasi' => '/api/lokasi.php'
            ]
        ];
        
        if ($healthCheck['success']) {
            http_response_code(200);
        } else {
            http_response_code(503); // Service Unavailable
        }
        
        echo json_encode($response);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Health check failed: ' . $e->getMessage(),
            'timestamp' => date('Y-m-d H:i:s')
        ]);
    }
} else {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method tidak diizinkan'
    ]);
}
?>
