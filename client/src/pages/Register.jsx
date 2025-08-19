import React from 'react';
import '../styles/Form.css';

function Register() {
  return (
    <form>
      <h2>Registro</h2>
      <label htmlFor="name">Nombre:</label>
      <input type="text" id="name" name="name" required />
      <label htmlFor="email">Email:</label>
      <input type="email" id="email" name="email" required />
      <label htmlFor="password">Contraseña:</label>
      <input type="password" id="password" name="password" required />
      <button type="submit">Registrarse</button>
    </form>
  );
}

export default Register;