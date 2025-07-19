<?php
// Database configuration class
// Headers are handled by individual API files, not here

class Database {
    private $host;
    private $db_name;
    private $username;
    private $password;
    private $conn;

    public function __construct() {
        // Environment-based configuration with fallbacks
        $this->host = $this->getEnvVar('DB_HOST', 'localhost');
        $this->db_name = $this->getEnvVar('DB_NAME', 'penjadwalan_db');
        $this->username = $this->getEnvVar('DB_USER', 'root');
        $this->password = $this->getEnvVar('DB_PASSWORD', '');

        // Log configuration in development
        if ($this->getEnvVar('APP_DEBUG', 'false') === 'true') {
            error_log("🔧 Database Configuration: Host={$this->host}, DB={$this->db_name}, User={$this->username}");
        }
    }

    /**
     * Get environment variable with fallback
     */
    private function getEnvVar($key, $default = null) {
        // Try $_ENV first, then getenv(), then default
        return $_ENV[$key] ?? getenv($key) ?: $default;
    }

    public function getConnection() {
        $this->conn = null;
        try {
            $this->conn = new PDO("mysql:host=" . $this->host . ";dbname=" . $this->db_name, $this->username, $this->password);
            $this->conn->exec("set names utf8");
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch(PDOException $exception) {
            error_log("Connection error: " . $exception->getMessage());
        }
        return $this->conn;
    }
}
?>