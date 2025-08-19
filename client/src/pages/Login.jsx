import React from 'react';
import '../styles/Form.css';

function Login() {
  return (
    <form>
      <h2>Iniciar Sesión</h2>
      <label htmlFor="email">Email:</label>
      <input type="email" id="email" name="email" required />
      <label htmlFor="password">Contraseña:</label>
      <input type="password" id="password" name="password" required />
      <button type="submit">Iniciar Sesión</button>
    </form>
  );
}

export default Login;