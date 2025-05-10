import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Jadwal() {
  const [jadwalList, setJadwalList] = useState([]);
  const [kegiatan, setKegiatan] = useState('');
  const [tanggal, setTanggal] = useState('');
  const [isLibur, setIsLibur] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    const savedJadwal = localStorage.getItem('jadwalList');
    if (savedJadwal) {
      setJadwalList(JSON.parse(savedJadwal));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('jadwalList', JSON.stringify(jadwalList));
  }, [jadwalList]);

  useEffect(() => {
    if (tanggal) {
      axios.get('https://api-harilibur.vercel.app/api')
        .then(res => {
          const libur = res.data.some(item => item.holiday_date === tanggal);
          setIsLibur(libur);
        });
    }
  }, [tanggal]);

  const handleTambah = (e) => {
    e.preventDefault();
    if (!kegiatan || !tanggal) return;

    const newData = { kegiatan, tanggal };

    if (editIndex !== null) {
      const newList = [...jadwalList];
      newList[editIndex] = newData;
      setJadwalList(newList);
      setEditIndex(null);
    } else {
      setJadwalList([...jadwalList, newData]);
    }

    setKegiatan('');
    setTanggal('');
  };

  const handleHapus = (index) => {
    const newList = jadwalList.filter((_, i) => i !== index);
    setJadwalList(newList);
  };

  const handleEdit = (index) => {
    const item = jadwalList[index];
    setKegiatan(item.kegiatan);
    setTanggal(item.tanggal);
    setEditIndex(index);
  };

  return (
    <div className="jadwal-container">
      <h2>{editIndex !== null ? 'Edit Jadwal' : 'Form Penjadwalan'}</h2>
      <form onSubmit={handleTambah}>
        <input
          type="text"
          placeholder="Nama kegiatan"
          value={kegiatan}
          onChange={(e) => setKegiatan(e.target.value)}
        />
        <input
          type="date"
          value={tanggal}
          onChange={(e) => setTanggal(e.target.value)}
        />
        {tanggal && (
          <p>{isLibur ? 'Hari libur nasional' : 'Hari kerja biasa'}</p>
        )}
        <button type="submit">{editIndex !== null ? 'Simpan Perubahan' : 'Tambah Jadwal'}</button>
      </form>

      <h3>Daftar Jadwal</h3>
      <ul>
        {jadwalList.map((item, index) => (
          <li key={index}>
            {item.tanggal} - {item.kegiatan}
            <button onClick={() => handleEdit(index)}>Edit</button>
            <button onClick={() => handleHapus(index)}>Hapus</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Jadwal;
