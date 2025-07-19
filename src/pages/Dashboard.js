import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ApiService from '../services/ApiService';
import JadwalStats from '../components/JadwalStats';

function Dashboard() {
    const [jadwal, setJadwal] = useState([]);
    const [liburDates, setLiburDates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            // Load jadwal dari API
            const jadwalResponse = await ApiService.getAllJadwal();
            if (jadwalResponse.success) {
                setJadwal(jadwalResponse.data);
            }

            // Load data hari libur nasional
            const liburResponse = await axios.get('https://api-harilibur.vercel.app/api');
            const dates = liburResponse.data.map(item => item.holiday_date);
            setLiburDates(dates);
        } catch (error) {
            setError('Gagal memuat data');
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Hitung statistik
    const totalKegiatan = jadwal.length;
    const totalHariLibur = jadwal.filter(j => liburDates.includes(j.tanggal)).length;

    // Jadwal yang akan datang (7 hari ke depan)
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    const jadwalMendatang = jadwal.filter(j => {
        const jadwalDate = new Date(j.tanggal);
        return jadwalDate >= today && jadwalDate <= nextWeek;
    }).slice(0, 5); // Ambil 5 jadwal terdekat

    // Jadwal hari ini
    const todayString = today.toISOString().split('T')[0];
    const jadwalHariIni = jadwal.filter(j => j.tanggal === todayString);

    if (loading) {
        return (
            <div className="dashboard-container">
                <h2>Dashboard</h2>
                <p>Memuat data...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="dashboard-container">
                <h2>Dashboard</h2>
                <div className="alert alert-error">
                    {error}
                    <button onClick={loadData} className="retry-btn">Coba Lagi</button>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <h2>Dashboard Penjadwalan</h2>

            {/* Detailed Statistics */}
            <JadwalStats jadwal={jadwal} liburDates={liburDates} />

            {/* Statistik Cards */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon">📅</div>
                    <div className="stat-content">
                        <h3>{totalKegiatan}</h3>
                        <p>Total Kegiatan</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">🏖️</div>
                    <div className="stat-content">
                        <h3>{totalHariLibur}</h3>
                        <p>Kegiatan di Hari Libur</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">📋</div>
                    <div className="stat-content">
                        <h3>{jadwalHariIni.length}</h3>
                        <p>Kegiatan Hari Ini</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">⏰</div>
                    <div className="stat-content">
                        <h3>{jadwalMendatang.length}</h3>
                        <p>Kegiatan Minggu Ini</p>
                    </div>
                </div>
            </div>

            {/* Jadwal Hari Ini */}
            <div className="dashboard-section">
                <h3>📅 Jadwal Hari Ini</h3>
                {jadwalHariIni.length === 0 ? (
                    <p className="no-data">Tidak ada kegiatan hari ini.</p>
                ) : (
                    <div className="jadwal-today">
                        {jadwalHariIni.map((item, index) => (
                            <div key={item.id} className="jadwal-item today">
                                <div className="jadwal-content">
                                    <h4>{item.kegiatan}</h4>
                                    <p>📅 {ApiService.formatDate(item.tanggal)}</p>
                                    {liburDates.includes(item.tanggal) && (
                                        <span className="holiday-badge">Hari Libur</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Jadwal Mendatang */}
            <div className="dashboard-section">
                <h3>⏰ Jadwal Mendatang (7 Hari Ke Depan)</h3>
                {jadwalMendatang.length === 0 ? (
                    <p className="no-data">Tidak ada kegiatan dalam 7 hari ke depan.</p>
                ) : (
                    <div className="jadwal-upcoming">
                        {jadwalMendatang.map((item, index) => (
                            <div key={item.id} className="jadwal-item upcoming">
                                <div className="jadwal-content">
                                    <h4>{item.kegiatan}</h4>
                                    <p>📅 {ApiService.formatDate(item.tanggal)}</p>
                                    {liburDates.includes(item.tanggal) && (
                                        <span className="holiday-badge">Hari Libur</span>
                                    )}
                                    {ApiService.isPastDate(item.tanggal) && (
                                        <span className="past-badge">Terlewat</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Tabel Ringkasan Jadwal */}
            <div className="dashboard-section">
                <h3>📊 Ringkasan Semua Jadwal</h3>
                {jadwal.length === 0 ? (
                    <p className="no-data">Belum ada jadwal yang ditambahkan.</p>
                ) : (
                    <div className="table-container">
                        <table className="dashboard-table">
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th>Kegiatan</th>
                                    <th>Tanggal</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {jadwal.slice(0, 10).map((item, index) => (
                                    <tr key={item.id}>
                                        <td>{index + 1}</td>
                                        <td>{item.kegiatan}</td>
                                        <td>{ApiService.formatDate(item.tanggal)}</td>
                                        <td>
                                            {ApiService.isPastDate(item.tanggal) && (
                                                <span className="status-badge past">Terlewat</span>
                                            )}
                                            {item.tanggal === todayString && (
                                                <span className="status-badge today">Hari Ini</span>
                                            )}
                                            {!ApiService.isPastDate(item.tanggal) && item.tanggal !== todayString && (
                                                <span className="status-badge upcoming">Mendatang</span>
                                            )}
                                            {liburDates.includes(item.tanggal) && (
                                                <span className="status-badge holiday">Hari Libur</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {jadwal.length > 10 && (
                            <p className="more-data">
                                Dan {jadwal.length - 10} jadwal lainnya...
                            </p>
                        )}
                    </div>
                )}
            </div>

            {/* Refresh Button */}
            <div className="dashboard-actions">
                <button onClick={loadData} className="refresh-btn">
                    🔄 Refresh Data
                </button>
            </div>
        </div>
    );
}

export default Dashboard;
