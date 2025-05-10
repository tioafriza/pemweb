import React, { useState } from 'react';
function Contact() {
  const [formData, setFormData] = useState({ nama: '', email: '', pesan: '' });
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Pesan terkirim!");
    setFormData({ nama: '', email: '', pesan: '' });
  };
  return (
    <div className="container">
      <h1>Kontak</h1>
      <form onSubmit={handleSubmit}>
        <input name="nama" value={formData.nama} onChange={handleChange} placeholder="Nama" />
        <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
        <textarea name="pesan" value={formData.pesan} onChange={handleChange} placeholder="Pesan" />
        <button type="submit">Kirim</button>
      </form>
    </div>
  );
}
export default Contact;
