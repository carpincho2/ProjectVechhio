import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';  // Agregaremos estilos específicos para el navbar

function Navbar() {
  return (
    <header className="header">
      <div>
        <Link to="/">
          <img src="/logo.png" alt="" className="logo" />
        </Link>
      </div>
      <div className="vehicles">
        <Link to="/vehicles">Vehicles</Link>
      </div>
      <div className="certified">
        <Link to="/certified">Certified</Link>
      </div>
      <div className="finance">
        <Link to="/finance">Finance</Link>
      </div>
      <div className="service">
        <Link to="/service">Service</Link>
      </div>
      <div className="aboutUs">
        <Link to="/about-us">About Us</Link>
      </div>
      <div className="Login">
        <Link to="/login">Login</Link>
      </div>
      <div className="register">
        <Link to="/register">Register</Link>
      </div>
    </header>
  );
}

export default Navbar;