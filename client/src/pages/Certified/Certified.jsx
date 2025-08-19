import React from 'react';
import { Link } from 'react-router-dom';
import './Certified.css';

function Certified() {
  return (
    <div>
      <section className="hero-banner">
        <div className="main-banner2">
          <img src="/logos/1c2213d01d64dd5c549fd14de6ebe445x.webp" alt="" className="banner-image" />
        </div>
      </section>
      <section className="explicacion">
        <h1 className="section-subtitle2">Vehículos Certificados</h1>
        <p className="text">
          Los vehículos certificados han pasado por un riguroso proceso de inspección y cumplen con los más altos estándares de calidad y seguridad. Ofrecemos una amplia gama de vehículos certificados de diferentes marcas y modelos, todos ellos con garantía y asistencia en carretera. Visita nuestra sección de vehículos certificados para encontrar el coche perfecto para ti.
        </p>
        <Link to="/vehicles">Ver Vehículos Certificados</Link>
      </section>
    </div>
  );
}

export default Certified;
