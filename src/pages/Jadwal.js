import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ApiService from '../services/ApiService';

function Jadwal() {
    const [jadwalList, setJadwalList] = useState([]);
    const [kegiatan, setKegiatan] = useState('');
    const [tanggal, setTanggal] = useState('');
    const [isLibur, setIsLibur] = useState(false);
    const [editIndex, setEditIndex] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDate, setFilterDate] = useState('');
    const [sortBy, setSortBy] = useState('tanggal');
    const [selectedItems, setSelectedItems] = useState([]);
    const [bulkMode, setBulkMode] = useState(false);

    // Load jadwal dari API saat komponen pertama kali dimuat
    useEffect(() => {
        loadJadwal();
    }, []);

    // Cek apakah tanggal adalah hari libur
    useEffect(() => {
        if (tanggal) {
            checkHoliday(tanggal);
        }
    }, [tanggal]);

    // Function untuk load semua jadwal dari API
    const loadJadwal = async () => {
        setLoading(true);
        try {
            const response = await ApiService.getAllJadwal();
            if (response.success) {
                setJadwalList(response.data);
            } else {
                setError('Gagal memuat jadwal');
            }
        } catch (error) {
            setError('Error koneksi ke server');
            console.error('Error loading jadwal:', error);
        } finally {
            setLoading(false);
        }
    };

    // Function untuk cek hari libur
    const checkHoliday = async (date) => {
        try {
            const response = await axios.get('https://api-harilibur.vercel.app/api');
            const libur = response.data.some(item => item.holiday_date === date);
            setIsLibur(libur);
        } catch (error) {
            console.error('Error checking holiday:', error);
        }
    };

    // Function untuk menambah jadwal baru
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!kegiatan.trim() || !tanggal) {
            setError('Kegiatan dan tanggal harus diisi');
            return;
        }

        setLoading(true);
        setError('');

        try {
            if (editIndex !== null) {
                // Update jadwal yang sudah ada
                const jadwalToUpdate = jadwalList[editIndex];
                const response = await ApiService.updateJadwal({
                    id: jadwalToUpdate.id,
                    kegiatan: kegiatan.trim(),
                    tanggal: tanggal
                });

                if (response.success) {
                    setSuccess('Jadwal berhasil diperbarui');
                    setEditIndex(null);
                    loadJadwal(); // Reload data
                } else {
                    setError(response.message || 'Gagal memperbarui jadwal');
                }
            } else {
                // Tambah jadwal baru
                const response = await ApiService.createJadwal({
                    kegiatan: kegiatan.trim(),
                    tanggal: tanggal
                });

                if (response.success) {
                    setSuccess('Jadwal berhasil ditambahkan');
                    loadJadwal(); // Reload data
                } else {
                    setError(response.message || 'Gagal menambahkan jadwal');
                }
            }

            // Reset form
            setKegiatan('');
            setTanggal('');
            setIsLibur(false);
        } catch (error) {
            setError('Error koneksi ke server');
            console.error('Error submitting jadwal:', error);
        } finally {
            setLoading(false);
        }
    };

    // Function untuk edit jadwal
    const handleEdit = (index) => {
        const jadwal = jadwalList[index];
        setKegiatan(jadwal.kegiatan);
        setTanggal(jadwal.tanggal);
        setEditIndex(index);
        setError('');
        setSuccess('');
    };

    // Function untuk hapus jadwal
    const handleDelete = async (index) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus jadwal ini?')) {
            setLoading(true);
            try {
                const jadwalToDelete = jadwalList[index];
                const response = await ApiService.deleteJadwal(jadwalToDelete.id);

                if (response.success) {
                    setSuccess('Jadwal berhasil dihapus');
                    loadJadwal(); // Reload data
                } else {
                    setError(response.message || 'Gagal menghapus jadwal');
                }
            } catch (error) {
                setError('Error koneksi ke server');
                console.error('Error deleting jadwal:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    // Function untuk cancel edit
    const handleCancelEdit = () => {
        setEditIndex(null);
        setKegiatan('');
        setTanggal('');
        setIsLibur(false);
        setError('');
        setSuccess('');
    };

    // Function untuk clear messages
    const clearMessages = () => {
        setError('');
        setSuccess('');
    };

    // Filter and sort jadwal
    const getFilteredAndSortedJadwal = () => {
        let filtered = jadwalList;

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(jadwal =>
                jadwal.kegiatan.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filter by date
        if (filterDate) {
            filtered = filtered.filter(jadwal => jadwal.tanggal === filterDate);
        }

        // Sort
        filtered.sort((a, b) => {
            if (sortBy === 'tanggal') {
                return new Date(a.tanggal) - new Date(b.tanggal);
            } else if (sortBy === 'kegiatan') {
                return a.kegiatan.localeCompare(b.kegiatan);
            } else if (sortBy === 'created_at') {
                return new Date(b.created_at) - new Date(a.created_at);
            }
            return 0;
        });

        return filtered;
    };

    const filteredJadwal = getFilteredAndSortedJadwal();

    // Export functions
    const exportToCSV = () => {
        const headers = ['No', 'Kegiatan', 'Tanggal', 'Dibuat'];
        const csvContent = [
            headers.join(','),
            ...filteredJadwal.map((jadwal, index) => [
                index + 1,
                `"${jadwal.kegiatan}"`,
                jadwal.tanggal,
                jadwal.created_at
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `jadwal_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const exportToJSON = () => {
        const jsonContent = JSON.stringify(filteredJadwal, null, 2);
        const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `jadwal_${new Date().toISOString().split('T')[0]}.json`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Bulk operations
    const toggleBulkMode = () => {
        setBulkMode(!bulkMode);
        setSelectedItems([]);
    };

    const toggleSelectItem = (id) => {
        setSelectedItems(prev =>
            prev.includes(id)
                ? prev.filter(item => item !== id)
                : [...prev, id]
        );
    };

    const selectAllItems = () => {
        if (selectedItems.length === filteredJadwal.length) {
            setSelectedItems([]);
        } else {
            setSelectedItems(filteredJadwal.map(jadwal => jadwal.id));
        }
    };

    const bulkDelete = async () => {
        if (selectedItems.length === 0) return;

        if (window.confirm(`Apakah Anda yakin ingin menghapus ${selectedItems.length} jadwal yang dipilih?`)) {
            setLoading(true);
            try {
                const deletePromises = selectedItems.map(id =>
                    ApiService.deleteJadwal(id)
                );

                const results = await Promise.all(deletePromises);
                const successCount = results.filter(result => result.success).length;

                if (successCount === selectedItems.length) {
                    setSuccess(`${successCount} jadwal berhasil dihapus`);
                } else {
                    setError(`${successCount} dari ${selectedItems.length} jadwal berhasil dihapus`);
                }

                setSelectedItems([]);
                setBulkMode(false);
                loadJadwal();
            } catch (error) {
                setError('Error saat menghapus jadwal');
                console.error('Bulk delete error:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="jadwal-container">
            <h2>Manajemen Jadwal</h2>

            {/* Alert messages */}
            {error && (
                <div className="alert alert-error">
                    {error}
                    <button onClick={clearMessages} className="close-btn">×</button>
                </div>
            )}
            {success && (
                <div className="alert alert-success">
                    {success}
                    <button onClick={clearMessages} className="close-btn">×</button>
                </div>
            )}

            {/* Form untuk tambah/edit jadwal */}
            <form onSubmit={handleSubmit} className="jadwal-form">
                <div className="form-group">
                    <label>Kegiatan:</label>
                    <input
                        type="text"
                        value={kegiatan}
                        onChange={(e) => setKegiatan(e.target.value)}
                        placeholder="Masukkan kegiatan..."
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Tanggal:</label>
                    <input
                        type="date"
                        value={tanggal}
                        onChange={(e) => setTanggal(e.target.value)}
                        required
                    />
                    {isLibur && (
                        <p className="holiday-warning">⚠️ Tanggal ini adalah hari libur nasional!</p>
                    )}
                </div>
                <div className="form-actions">
                    <button type="submit" disabled={loading}>
                        {loading ? 'Memproses...' : editIndex !== null ? 'Perbarui' : 'Tambah'}
                    </button>
                    {editIndex !== null && (
                        <button type="button" onClick={handleCancelEdit} className="cancel-btn">
                            Batal
                        </button>
                    )}
                </div>
            </form>

            {/* Search and Filter Controls */}
            <div className="jadwal-controls">
                <div className="search-filter-row">
                    <div className="search-box">
                        <input
                            type="text"
                            placeholder="Cari kegiatan..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                    </div>
                    <div className="filter-box">
                        <input
                            type="date"
                            value={filterDate}
                            onChange={(e) => setFilterDate(e.target.value)}
                            className="filter-date"
                        />
                    </div>
                    <div className="sort-box">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="sort-select"
                        >
                            <option value="tanggal">Urutkan: Tanggal</option>
                            <option value="kegiatan">Urutkan: Kegiatan</option>
                            <option value="created_at">Urutkan: Terbaru</option>
                        </select>
                    </div>
                    <button
                        onClick={() => {
                            setSearchTerm('');
                            setFilterDate('');
                            setSortBy('tanggal');
                        }}
                        className="clear-filters-btn"
                    >
                        🗑️ Reset
                    </button>
                </div>
                <div className="export-controls">
                    <button
                        onClick={exportToCSV}
                        className="export-btn csv-btn"
                        disabled={filteredJadwal.length === 0}
                    >
                        📊 Export CSV
                    </button>
                    <button
                        onClick={exportToJSON}
                        className="export-btn json-btn"
                        disabled={filteredJadwal.length === 0}
                    >
                        📄 Export JSON
                    </button>
                    <button
                        onClick={toggleBulkMode}
                        className={`bulk-mode-btn ${bulkMode ? 'active' : ''}`}
                    >
                        {bulkMode ? '❌ Batal Pilih' : '☑️ Pilih Banyak'}
                    </button>
                </div>

                {bulkMode && (
                    <div className="bulk-controls">
                        <div className="bulk-info">
                            <span>{selectedItems.length} item dipilih</span>
                            <button
                                onClick={selectAllItems}
                                className="select-all-btn"
                            >
                                {selectedItems.length === filteredJadwal.length ? 'Batal Pilih Semua' : 'Pilih Semua'}
                            </button>
                        </div>
                        {selectedItems.length > 0 && (
                            <div className="bulk-actions">
                                <button
                                    onClick={bulkDelete}
                                    className="bulk-delete-btn"
                                    disabled={loading}
                                >
                                    🗑️ Hapus Terpilih ({selectedItems.length})
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Tabel daftar jadwal */}
            <div className="jadwal-list">
                <h3>
                    Daftar Jadwal
                    ({filteredJadwal.length} dari {jadwalList.length} kegiatan)
                    {searchTerm && <span className="search-indicator"> - "{searchTerm}"</span>}
                    {filterDate && <span className="filter-indicator"> - {ApiService.formatDate(filterDate)}</span>}
                </h3>

                {loading && <p>Memuat jadwal...</p>}

                {jadwalList.length === 0 && !loading ? (
                    <p>Belum ada jadwal yang ditambahkan.</p>
                ) : filteredJadwal.length === 0 && !loading ? (
                    <p>Tidak ada jadwal yang sesuai dengan filter.</p>
                ) : (
                    <table className="jadwal-table">
                        <thead>
                            <tr>
                                {bulkMode && <th>Pilih</th>}
                                <th>No</th>
                                <th>Kegiatan</th>
                                <th>Tanggal</th>
                                {!bulkMode && <th>Aksi</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredJadwal.map((jadwal, index) => {
                                const originalIndex = jadwalList.findIndex(j => j.id === jadwal.id);
                                return (
                                <tr key={jadwal.id} className={selectedItems.includes(jadwal.id) ? 'selected' : ''}>
                                    {bulkMode && (
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={selectedItems.includes(jadwal.id)}
                                                onChange={() => toggleSelectItem(jadwal.id)}
                                                className="bulk-checkbox"
                                            />
                                        </td>
                                    )}
                                    <td>{index + 1}</td>
                                    <td>{jadwal.kegiatan}</td>
                                    <td>{ApiService.formatDate(jadwal.tanggal)}</td>
                                    {!bulkMode && (
                                        <td>
                                            <button
                                                onClick={() => handleEdit(originalIndex)}
                                                className="edit-btn"
                                                disabled={loading}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(originalIndex)}
                                                className="delete-btn"
                                                disabled={loading}
                                            >
                                                Hapus
                                            </button>
                                        </td>
                                    )}
                                </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

export default Jadwal;
