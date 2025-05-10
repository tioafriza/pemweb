import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav>
      <ul>
        <li><Link to="/">Beranda</Link></li>
        <li><Link to="/about">Tentang</Link></li>
        <li><Link to="/jadwal">Jadwal</Link></li>
        <li><Link to="/contact">Kontak</Link></li>
        <li><Link to="/dashboard">Dashboard</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
