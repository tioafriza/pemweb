import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Dashboard() {
  const [jadwal, setJadwal] = useState([]);
  const [liburDates, setLiburDates] = useState([]);

  useEffect(() => {
    // Ambil jadwal dari localStorage
    const data = localStorage.getItem('jadwalList');
    if (data) {
      setJadwal(JSON.parse(data));
    }

    // Ambil data libur nasional
    axios.get('https://api-harilibur.vercel.app/api')
      .then(res => {
        const dates = res.data.map(item => item.holiday_date);
        setLiburDates(dates);
      });
  }, []);

  const totalKegiatan = jadwal.length;
  const totalHariLibur = jadwal.filter(j => liburDates.includes(j.tanggal)).length;

  return (
    <div className="container">
      <h1>Dashboard</h1>

      <div style={{
        display: 'flex', justifyContent: 'space-between', marginBottom: '20px'
      }}>
        <div style={{
          background: '#e3f2fd', padding: '20px', borderRadius: '10px', flex: 1, marginRight: '10px'
        }}>
          <h3>Total Kegiatan</h3>
          <p style={{ fontSize: '2em' }}>{totalKegiatan}</p>
        </div>
        <div style={{
          background: '#ffe0b2', padding: '20px', borderRadius: '10px', flex: 1, marginLeft: '10px'
        }}>
          <h3>Kegiatan di Hari Libur</h3>
          <p style={{ fontSize: '2em' }}>{totalHariLibur}</p>
        </div>
      </div>

      <h2>Ringkasan Jadwal</h2>
      <table style={{
        width: '100%', borderCollapse: 'collapse'
      }}>
        <thead>
          <tr style={{ background: '#f2f2f2' }}>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Tanggal</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Kegiatan</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Hari Libur?</th>
          </tr>
        </thead>
        <tbody>
          {jadwal.map((item, i) => (
            <tr key={i}>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{item.tanggal}</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{item.kegiatan}</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                {liburDates.includes(item.tanggal) ? 'Ya' : 'Tidak'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Dashboard;
