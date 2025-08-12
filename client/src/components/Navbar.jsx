import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';  // Agregaremos estilos específicos para el navbar

function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          Concesionaria
        </Link>
        <div className="nav-links">
          <Link to="/" className="nav-link">Inicio</Link>
          <Link to="/login" className="nav-link">Login</Link>
          <Link to="/register" className="nav-link">Registro</Link>
          <Link to="/vehicles" className="nav-link">Vehículos</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;