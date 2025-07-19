<?php
/**
 * CORS Helper for Penjadwalan App API
 * Handles Cross-Origin Resource Sharing headers
 */

// Prevent duplicate headers
if (!defined('CORS_HEADERS_SET')) {
    define('CORS_HEADERS_SET', true);

    // Let Apache handle all CORS headers globally!
    // Only handle preflight OPTIONS and set content-type here.
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit();
    }
    // Set content type for API responses
    header('Content-Type: application/json; charset=utf-8');
}
?>
