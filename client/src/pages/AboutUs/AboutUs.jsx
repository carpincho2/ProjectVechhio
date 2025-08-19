import React from 'react';
import './AboutUs.css';

function AboutUs() {
  return (
    <section className="aboutus-container">
      <h1 className="aboutus-title">Quiénes Somos</h1>
      <p className="aboutus-description">
        Somos más que una concesionaria: somos un equipo apasionado por brindarte excelencia en cada kilómetro. Desde hace más de 10 años, acompañamos a nuestros clientes con atención personalizada, vehículos certificados y servicios de postventa premium.
      </p>

      <div className="aboutus-grid">
        <div className="aboutus-image">
          <img src="/imagenes/showroom.jpg" alt="Showroom moderno" />
        </div>
        <div className="aboutus-text">
          <h2>Nuestra Misión</h2>
          <p>Ofrecer una experiencia de compra y servicio basada en la confianza, calidad y satisfacción total.</p>

          <h2>Visión</h2>
          <p>Ser líderes en innovación, atención al cliente y compromiso con el futuro sustentable del transporte.</p>

          <h2>Valores</h2>
          <ul>
            <li>🚗 Compromiso con la excelencia</li>
            <li>💬 Comunicación transparente</li>
            <li>⚙️ Profesionalismo técnico</li>
            <li>🤝 Cercanía y respeto por el cliente</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

export default AboutUs;
