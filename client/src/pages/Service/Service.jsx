import React from 'react';
import './Service.css';

function Service() {
  return (
    <section className="service-container">
      <h1 className="service-title">Servicio Técnico Oficial</h1>
      <p className="service-description">
        Cuidamos tu vehículo como si fuera nuestro. Nuestro equipo especializado asegura calidad, rapidez y transparencia.
      </p>

      <div className="service-grid">
        <div className="service-card">
          <h2>🧰 Mantenimiento Preventivo</h2>
          <p>Cambio de aceite, filtros, correas, y revisión general del vehículo.</p>
        </div>
        <div className="service-card">
          <h2>🛠 Revisión Completa</h2>
          <p>Chequeo electrónico, diagnosis de fallas y ajustes generales.</p>
        </div>
        <div className="service-card">
          <h2>🛞 Frenos y Suspensión</h2>
          <p>Revisión y reemplazo de frenos, amortiguadores y alineación.</p>
        </div>
      </div>

      <div className="service-form-container">
        <h2>Solicitá tu turno</h2>
        <form className="service-form">
          <input type="text" placeholder="Nombre completo" required />
          <input type="email" placeholder="Correo" required />
          <input type="text" placeholder="Patente del vehículo" required />
          <input type="date" required />
          <textarea placeholder="Comentarios opcionales"></textarea>
          <button type="submit">Pedir Turno</button>
        </form>
      </div>
    </section>
  );
}

export default Service;
