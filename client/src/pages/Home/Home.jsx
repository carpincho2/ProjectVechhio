import React from 'react';
import './Home.css';

function Home() {
  return (
    <div className="home">
      <div className="main-banner">
        <img src="/banner.png" alt="" className="banner-image" />
      </div>
      
      <div className="direcciones">
        <h2>Ubicaciones</h2>
        <p>Avenida Siempreviva 742, Springfield</p>
        <p>Av. Corrientes 1234, Buenos Aires</p>
        <p>Av. Brasil 999, São Paulo</p>
        <p>Shibuya Crossing 1-2-3, Tokio</p>
        <p>5th Avenue 789, New York</p>
      </div>

      <h2 className="titlevehicles">Vehículos Destacados</h2>
      
      <section className="featurevehicles">
        <div className="carbox">
          <img src="/logos/lexus.jpg" alt="Lexus NX" className="car" />
          <h2 className="section-subtitlecar">NX 350h Luxury</h2>
          <p className="description">
            La nueva NX 350h incorpora un motor naftero ciclo Atkinson de 2,5 litros y 16 válvulas. 
            La potencia máxima combinada resultante del motor naftero y el motor eléctrico es de 242 CV, 
            un 23% superior a la generación anterior. La transmisión de la NX 350h es híbrida automática 
            (e-CVT) continuamente variable y controlada electrónicamente.
          </p>
        </div>
        <div className="carbox">
          <img src="/logos/43e90958-0dbb-4164-8f59-2a8851ef0256.jpg" alt="Ford Mustang" className="car" />
          <h2 className="section-subtitlecar">Mustang GT</h2>
          <p className="description">
            V8 de 5.0L con hasta 486 CV, pura potencia americana con diseño moderno, ideal para hacer rugir el asfalto.
          </p>
        </div>
        <div className="carbox">
          <img src="/logos/208.jpg" alt="Peugeot 208" className="car" />
          <h2 className="section-subtitlecar">Peugeot 208</h2>
          <p className="description">
            hatch urbano con estética deportiva, gran eficiencia y tecnología i-Cockpit para una conducción ágil y conectada.
          </p>
        </div>
      </section>

      <section className="contactUs">
        <h2 className="title">Contact us</h2>
        <form action="#" method="post" className="formulario">
          <label htmlFor="nombre">Nombre:</label>
          <input type="text" id="nombre" name="nombre" placeholder="Your Name" className="input" />
          
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" placeholder="Your Email" className="input" required />
          
          <label htmlFor="mensaje">Mensaje:</label>
          <textarea id="mensaje" name="mensaje" className="input"></textarea>
          
          <button type="submit" className="boton">Enviar</button>
        </form>
      </section>

      <footer className="footer">
        <div className="footer-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
        </div>
        <div className="footer-icons">
          <a href="#"><i className="fab fa-twitter"></i></a>
          <a href="#"><i className="fab fa-whatsapp"></i></a>
          <a href="#"><i className="fab fa-instagram"></i></a>
        </div>              
        <p className="footer-copy">© 2024 CarPane. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Home;
