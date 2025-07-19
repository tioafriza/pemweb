import React from 'react';

function JadwalStats({ jadwal, liburDates }) {
    // Calculate various statistics
    const totalKegiatan = jadwal.length;
    
    // Group by month
    const monthlyStats = jadwal.reduce((acc, item) => {
        const month = new Date(item.tanggal).toLocaleDateString('id-ID', { 
            year: 'numeric', 
            month: 'long' 
        });
        acc[month] = (acc[month] || 0) + 1;
        return acc;
    }, {});

    // Upcoming vs past events
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const upcomingEvents = jadwal.filter(item => new Date(item.tanggal) >= today);
    const pastEvents = jadwal.filter(item => new Date(item.tanggal) < today);
    
    // Events on holidays
    const holidayEvents = jadwal.filter(item => liburDates.includes(item.tanggal));
    
    // This week's events
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    
    const thisWeekEvents = jadwal.filter(item => {
        const eventDate = new Date(item.tanggal);
        return eventDate >= startOfWeek && eventDate <= endOfWeek;
    });

    // This month's events
    const thisMonthEvents = jadwal.filter(item => {
        const eventDate = new Date(item.tanggal);
        return eventDate.getMonth() === today.getMonth() && 
               eventDate.getFullYear() === today.getFullYear();
    });

    // Most active day of week
    const dayStats = jadwal.reduce((acc, item) => {
        const dayName = new Date(item.tanggal).toLocaleDateString('id-ID', { weekday: 'long' });
        acc[dayName] = (acc[dayName] || 0) + 1;
        return acc;
    }, {});
    
    const mostActiveDay = Object.entries(dayStats).reduce((a, b) => 
        dayStats[a[0]] > dayStats[b[0]] ? a : b, ['', 0]
    );

    return (
        <div className="jadwal-stats">
            <h3>📊 Statistik Jadwal</h3>
            
            <div className="stats-grid">
                <div className="stat-card primary">
                    <div className="stat-icon">📅</div>
                    <div className="stat-content">
                        <h4>{totalKegiatan}</h4>
                        <p>Total Kegiatan</p>
                    </div>
                </div>

                <div className="stat-card success">
                    <div className="stat-icon">⏭️</div>
                    <div className="stat-content">
                        <h4>{upcomingEvents.length}</h4>
                        <p>Akan Datang</p>
                    </div>
                </div>

                <div className="stat-card info">
                    <div className="stat-icon">⏮️</div>
                    <div className="stat-content">
                        <h4>{pastEvents.length}</h4>
                        <p>Sudah Lewat</p>
                    </div>
                </div>

                <div className="stat-card warning">
                    <div className="stat-icon">🏖️</div>
                    <div className="stat-content">
                        <h4>{holidayEvents.length}</h4>
                        <p>Di Hari Libur</p>
                    </div>
                </div>

                <div className="stat-card secondary">
                    <div className="stat-icon">📆</div>
                    <div className="stat-content">
                        <h4>{thisWeekEvents.length}</h4>
                        <p>Minggu Ini</p>
                    </div>
                </div>

                <div className="stat-card accent">
                    <div className="stat-icon">🗓️</div>
                    <div className="stat-content">
                        <h4>{thisMonthEvents.length}</h4>
                        <p>Bulan Ini</p>
                    </div>
                </div>
            </div>

            {totalKegiatan > 0 && (
                <div className="detailed-stats">
                    <div className="stat-section">
                        <h4>📈 Statistik Bulanan</h4>
                        <div className="monthly-stats">
                            {Object.entries(monthlyStats).map(([month, count]) => (
                                <div key={month} className="month-stat">
                                    <span className="month-name">{month}</span>
                                    <span className="month-count">{count} kegiatan</span>
                                    <div className="month-bar">
                                        <div 
                                            className="month-fill" 
                                            style={{ 
                                                width: `${(count / Math.max(...Object.values(monthlyStats))) * 100}%` 
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {mostActiveDay[0] && (
                        <div className="stat-section">
                            <h4>🎯 Hari Paling Aktif</h4>
                            <div className="active-day">
                                <span className="day-name">{mostActiveDay[0]}</span>
                                <span className="day-count">({mostActiveDay[1]} kegiatan)</span>
                            </div>
                        </div>
                    )}

                    <div className="stat-section">
                        <h4>📊 Ringkasan</h4>
                        <div className="summary-stats">
                            <p>
                                <strong>Rata-rata per bulan:</strong> {
                                    Object.keys(monthlyStats).length > 0 
                                        ? Math.round(totalKegiatan / Object.keys(monthlyStats).length)
                                        : 0
                                } kegiatan
                            </p>
                            <p>
                                <strong>Persentase di hari libur:</strong> {
                                    totalKegiatan > 0 
                                        ? Math.round((holidayEvents.length / totalKegiatan) * 100)
                                        : 0
                                }%
                            </p>
                            <p>
                                <strong>Kegiatan mendatang:</strong> {
                                    totalKegiatan > 0 
                                        ? Math.round((upcomingEvents.length / totalKegiatan) * 100)
                                        : 0
                                }%
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default JadwalStats;
