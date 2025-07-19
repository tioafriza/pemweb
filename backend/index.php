<?php


header('Content-Type: text/html; charset=UTF-8');
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Penjadwalan App - Backend API</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #333;
            line-height: 1.6;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }

        .header {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            margin-bottom: 30px;
            text-align: center;
        }

        .header h1 {
            color: #2c3e50;
            margin-bottom: 10px;
            font-size: 2.5em;
        }

        .header p {
            color: #666;
            font-size: 1.1em;
        }

        .status-card {
            background: white;
            padding: 25px;
            border-radius: 10px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.1);
            margin-bottom: 30px;
        }

        .status-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }

        .status-item {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #3498db;
            text-align: center;
        }

        .status-item.success {
            border-left-color: #27ae60;
            background: #d4edda;
        }

        .status-item.error {
            border-left-color: #e74c3c;
            background: #f8d7da;
        }

        .status-item h3 {
            color: #2c3e50;
            margin-bottom: 10px;
        }

        .endpoint {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
        }

        .endpoint h4 {
            color: #2c3e50;
            margin-bottom: 10px;
        }

        .method {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 0.8em;
            font-weight: bold;
            margin-right: 10px;
        }

        .method.get { background: #3498db; color: white; }
        .method.post { background: #27ae60; color: white; }
        .method.put { background: #f39c12; color: white; }
        .method.delete { background: #e74c3c; color: white; }

        .code-block {
            background: #2c3e50;
            color: #ecf0f1;
            padding: 15px;
            border-radius: 5px;
            overflow-x: auto;
            margin: 10px 0;
        }

        .test-btn {
            background: #3498db;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            transition: background 0.2s;
        }

        .test-btn:hover {
            background: #2980b9;
        }

        .footer {
            text-align: center;
            color: white;
            margin-top: 30px;
            padding: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🗓️ Penjadwalan App Backend API</h1>
            <p>RESTful API untuk Manajemen Jadwal Kegiatan</p>
            <p><strong>Project-Based Test - Pemrograman Web</strong></p>
        </div>

        <div class="status-card">
            <h2>📚 API Documentation</h2>
            <p>Silakan gunakan endpoint berikut untuk mengakses data jadwal, kategori, dan lokasi:</p>
            <ul style="margin: 15px 0; padding-left: 20px;">
                <li><code>GET /api/jadwal.php</code> - List semua jadwal</li>
                <li><code>POST /api/jadwal.php</code> - Tambah jadwal</li>
                <li><code>PUT /api/jadwal.php</code> - Edit jadwal</li>
                <li><code>DELETE /api/jadwal.php</code> - Hapus jadwal</li>
                <li><code>GET /api/kategori.php</code> - List kategori</li>
                <li><code>GET /api/lokasi.php</code> - List lokasi</li>
            </ul>
            <p>Gunakan tools seperti Postman, curl, atau Thunder Client untuk menguji endpoint.</p>
        </div>
                <div class="status-item success">
                    <h3>✅ PHP</h3>
                    <p>Version: <?php echo phpversion(); ?></p>
                </div>
                <div class="status-item <?php 
                    try {
                        require_once 'config/database.php';
                        $db = new Database();
                        $conn = $db->getConnection();
                        echo $conn ? 'success' : 'error';
                    } catch (Exception $e) {
                        echo 'error';
                    }
                ?>">
                    <h3><?php 
                        try {
                            require_once 'config/database.php';
                            $db = new Database();
                            $conn = $db->getConnection();
                            echo $conn ? '✅ Database' : '❌ Database';
                        } catch (Exception $e) {
                            echo '❌ Database';
                        }
                    ?></h3>
                    <p><?php 
                        try {
                            require_once 'config/database.php';
                            $db = new Database();
                            $conn = $db->getConnection();
                            echo $conn ? 'Connected' : 'Connection Failed';
                        } catch (Exception $e) {
                            echo 'Connection Failed';
                        }
                    ?></p>
                </div>
                <div class="status-item success">
                    <h3>✅ CORS</h3>
                    <p>Enabled</p>
                </div>
                <div class="status-item success">
                    <h3>✅ API</h3>
                    <p>Active</p>
                </div>
            </div>
        </div>

        <!-- API Documentation -->
        <div class="status-card">
            <h2>📚 API Endpoints</h2>
            <p>Base URL: <strong><?php echo 'http://' . $_SERVER['HTTP_HOST'] . dirname($_SERVER['PHP_SELF']); ?>/api/jadwal.php</strong></p>

            <div class="endpoint">
                <h4><span class="method get">GET</span> Ambil Semua Jadwal</h4>
                <div class="code-block">GET /api/jadwal.php</div>
                <p>Mengambil daftar semua jadwal yang tersimpan.</p>
            </div>

            <div class="endpoint">
                <h4><span class="method get">GET</span> Ambil Jadwal Berdasarkan ID</h4>
                <div class="code-block">GET /api/jadwal.php?id=1</div>
                <p>Mengambil jadwal berdasarkan ID tertentu.</p>
            </div>

            <div class="endpoint">
                <h4><span class="method post">POST</span> Tambah Jadwal Baru</h4>
                <div class="code-block">POST /api/jadwal.php
Content-Type: application/json

{
    "kegiatan": "Meeting dengan klien",
    "tanggal": "2025-07-20"
}</div>
                <p>Menambahkan jadwal baru ke dalam sistem.</p>
            </div>

            <div class="endpoint">
                <h4><span class="method put">PUT</span> Update Jadwal</h4>
                <div class="code-block">PUT /api/jadwal.php
Content-Type: application/json

{
    "id": 1,
    "kegiatan": "Meeting Updated",
    "tanggal": "2025-07-21"
}</div>
                <p>Memperbarui jadwal yang sudah ada.</p>
            </div>

            <div class="endpoint">
                <h4><span class="method delete">DELETE</span> Hapus Jadwal</h4>
                <div class="code-block">DELETE /api/jadwal.php
Content-Type: application/json

{
    "id": 1
}</div>
                <p>Menghapus jadwal dari sistem.</p>
            </div>
        </div>

        <!-- Database Schema -->
        <div class="status-card">
            <h2>🗄️ Database Schema</h2>
            <div class="code-block">
CREATE TABLE jadwal (
    id INT AUTO_INCREMENT PRIMARY KEY,
    kegiatan VARCHAR(255) NOT NULL,
    tanggal DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
            </div>
        </div>

        <!-- Sample Data -->
        <div class="status-card">
            <h2>📋 Sample Data</h2>
            <?php 
            try {
                require_once 'models/JadwalModel.php';
                $jadwalModel = new JadwalModel();
                $result = $jadwalModel->readAll();

                if ($result['success'] && count($result['data']) > 0) {
                    echo '<p>Total jadwal: <strong>' . $result['total'] . '</strong></p>';
                    echo '<table border="1" cellpadding="10" cellspacing="0" style="width: 100%; border-collapse: collapse; margin-top: 15px;">';
                    echo '<tr style="background: #f8f9fa;">';
                    echo '<th>ID</th><th>Kegiatan</th><th>Tanggal</th><th>Dibuat</th>';
                    echo '</tr>';

                    foreach (array_slice($result['data'], 0, 5) as $jadwal) {
                        echo '<tr>';
                        echo '<td>' . $jadwal['id'] . '</td>';
                        echo '<td>' . htmlspecialchars($jadwal['kegiatan']) . '</td>';
                        echo '<td>' . date('d/m/Y', strtotime($jadwal['tanggal'])) . '</td>';
                        echo '<td>' . date('d/m/Y H:i', strtotime($jadwal['created_at'])) . '</td>';
                        echo '</tr>';
                    }
                    echo '</table>';

                    if ($result['total'] > 5) {
                        echo '<p style="margin-top: 10px; font-style: italic;">Dan ' . ($result['total'] - 5) . ' jadwal lainnya...</p>';
                    }
                } else {
                    echo '<p>Belum ada data jadwal. Gunakan endpoint POST untuk menambah data.</p>';
                }
            } catch (Exception $e) {
                echo '<p style="color: red;">Error: ' . htmlspecialchars($e->getMessage()) . '</p>';
            }
            ?>
        </div>

        <!-- Testing Tools -->
        <div class="status-card">
            <h2>🧪 Testing Tools</h2>
            <p>Untuk menguji API, gunakan tools berikut:</p>
            <ul style="margin: 15px 0; padding-left: 20px;">
                <li><strong>Postman</strong> - Recommended untuk testing manual</li>
                <li><strong>curl</strong> - Command line testing</li>
                <li><strong>Browser</strong> - Untuk endpoint GET</li>
                <li><strong>Thunder Client</strong> - VSCode extension</li>
            </ul>

            <h3>Sample curl Commands:</h3>
            <div class="code-block">
# GET all jadwal
curl http://{HOST}/api/jadwal.php

# GET all kategori
curl http://{HOST}/api/kategori.php

# GET all lokasi
curl http://{HOST}/api/lokasi.php

# Health check
curl http://{HOST}/api/health.php

# POST new jadwal
curl -X POST http://{HOST}/api/jadwal.php -H "Content-Type: application/json" -d '{"kegiatan":"Test API","tanggal":"2025-07-25"}'

<!-- PHP: Show resolved HOST for clarity -->
<script>document.querySelectorAll('.code-block').forEach(function(el){el.innerHTML = el.innerHTML.replace(/{HOST}/g, location.host);});</script>
            </div>
        </div>

        <!-- Quick Test -->
        <div class="status-card">
            <h2>⚡ Quick Test</h2>
            <p>Klik tombol di bawah untuk test cepat API:</p>
            <button class="test-btn" onclick="testAPI()">Test GET API</button>
            <div id="test-result" style="margin-top: 15px;"></div>
        </div>
    </div>

    <div class="footer">
        <p>&copy; 2025 Penjadwalan App - Project Based Test</p>
        <p>Developed by: <strong>Tio Afriza & Yales Vepa</strong></p>
        <p>Mata Kuliah: <strong>Pemrograman Web</strong></p>
    </div>

    <script>
        function testAPI() {
            const resultDiv = document.getElementById('test-result');
            resultDiv.innerHTML = 'Testing...';
            // Always use absolute URL to backend
            const apiUrl = window.location.origin + '/api/jadwal.php';
            fetch(apiUrl)
                .then(response => response.json())
                .then(data => {
                    resultDiv.innerHTML = `
                        <div style="background: #e0ffe0; padding: 15px; border-radius: 5px; margin-top: 10px;">
                            <h4>✅ API Test Success!</h4>
                            <pre style="margin-top: 10px; overflow-x: auto;">${JSON.stringify(data, null, 2)}</pre>
                        </div>
                    `;
                })
                .catch(error => {
                    resultDiv.innerHTML = `
                        <div style="background: #f8d7da; padding: 15px; border-radius: 5px; margin-top: 10px;">
                            <h4>❌ API Test Failed!</h4>
                            <p>Error: ${error.message}</p>
                        </div>
                    `;
                });
        }
    </script>
</body>
</html>
