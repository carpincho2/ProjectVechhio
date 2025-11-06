import { AuthService } from '../services.js';
import { showMessage } from '../utils.js';

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('error-message');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            // Limpiar mensaje de error anterior
            errorMessage.textContent = '';
            
            // Intento de login
            const response = await AuthService.login({
                username,
                password
            });

            if (response.token) {
                // Guardar token y datos del usuario
                localStorage.setItem('jwtToken', response.token);
                localStorage.setItem('userName', response.user.username);
                localStorage.setItem('userRole', response.user.role);

                // Redireccionar según el rol
                const redirectUrl = new URLSearchParams(window.location.search).get('redirect');
                if (redirectUrl) {
                    window.location.href = redirectUrl;
                } else if (response.user.role === 'admin' || response.user.role === 'superadmin') {
                    window.location.href = '/panel-control.html';
                } else {
                    window.location.href = '/index.html';
                }
            }
        } catch (error) {
            console.error('Error de login:', error);
            showMessage('error-message', 'Usuario o contraseña incorrectos', 'error');
        }
    });

    // Google Sign In
    const googleBtn = document.querySelector('.btn-google');
    if (googleBtn) {
        googleBtn.addEventListener('click', () => {
            // Implementar login con Google aquí
            console.log('Google login - por implementar');
        });
    }
});