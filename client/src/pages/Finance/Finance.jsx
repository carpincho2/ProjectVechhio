import React, { useState } from 'react';
import './Finance.css';

function Finance() {
  const [monto, setMonto] = useState(0);
  const [cuotas, setCuotas] = useState(12);
  const [resultado, setResultado] = useState(0);

  const calcularCuota = () => {
    // Simple interest calculation for demonstration
    const tasaInteres = 0.25; // 25% annual interest
    const interes = (monto * tasaInteres) / 12;
    const cuota = (monto / cuotas) + interes;
    setResultado(cuota.toFixed(2));
  };

  return (
    <section className="finance-container">
      <h1 className="finance-title">Opciones de Financiación</h1>
      <p className="finance-description">
        Ofrecemos planes accesibles para que puedas manejar el auto de tus sueños. Cuotas fijas, tasas bajas y asesoramiento personalizado.
      </p>

      <div className="finance-grid">
        <div className="finance-card">
          <h2>Créditos Flexibles</h2>
          <p>Elegí la cantidad de cuotas, el tipo de vehículo y obtené la mejor tasa del mercado.</p>
        </div>
        <div className="finance-card">
          <h2>Simulador</h2>
          <form className="finance-form">
            <label htmlFor="monto">Monto a financiar</label>
            <input
              type="number"
              id="monto"
              placeholder="Ej: 3000000"
              min="100000"
              step="10000"
              onChange={(e) => setMonto(Number(e.target.value))}
            />

            <label htmlFor="cuotas">Cuotas</label>
            <select id="cuotas" onChange={(e) => setCuotas(Number(e.target.value))}>
              <option value="12">12</option>
              <option value="24">24</option>
              <option value="36">36</option>
            </select>

            <button type="button" onClick={calcularCuota}>
              Calcular
            </button>
          </form>
          <p className="finance-result">
            Tu cuota aproximada es: <span id="result">{resultado}</span>
          </p>
        </div>
        <div className="finance-card">
          <h2>Ventajas Exclusivas</h2>
          <ul>
            <li>Preaprobación online</li>
            <li>Bonificación de seguro</li>
            <li>Atención personalizada</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

export default Finance;
