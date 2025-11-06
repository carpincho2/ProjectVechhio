import { clearAuth, setToken, setUserInfo, verifyAuth } from './auth.js';

document.addEventListener('DOMContentLoaded', function() {
    const errorMessageElement = document.getElementById('errorMessage');
    const successMessageElement = document.getElementById('successMessage');

    function displayMessage(element, message, type) {
        element.textContent = message;
        element.style.display = 'block';
        if (type === 'error') {
            element.classList.add('error');
            element.classList.remove('success');
        } else if (type === 'success') {
            element.classList.add('success');
            element.classList.remove('error');
        }
    }

    function clearMessages() {
        errorMessageElement.textContent = '';
        errorMessageElement.style.display = 'none';
        errorMessageElement.classList.remove('error', 'success');
        successMessageElement.textContent = '';
        successMessageElement.style.display = 'none';
        successMessageElement.classList.remove('error', 'success');
    }

    const urlParams = new URLSearchParams(window.location.search);
    const errorParam = urlParams.get('error');
    const successParam = urlParams.get('success');

    if (errorParam) displayMessage(errorMessageElement, decodeURIComponent(errorParam), 'error');
    if (successParam) displayMessage(successMessageElement, decodeURIComponent(successParam), 'success');

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            clearMessages();

            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value;

            if (!username || !password) {
                displayMessage(errorMessageElement, 'Por favor, completa todos los campos.', 'error');
                return;
            }

            try {
                clearAuth();

                const response = await fetch('https://projectvechhio.onrender.com/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });

                const data = await response.json();

                if (response.ok && data.success) {
                    const user = data.data.user;
                    const token = data.data.token;
                    setToken(token);
                    setUserInfo(user);

                    const verifyResponse = await fetch('https://projectvechhio.onrender.com/api/auth/check', {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });

                    const verifyData = await verifyResponse.json();
                    if (!verifyResponse.ok || !verifyData.loggedIn) {
                        localStorage.clear();
                        throw new Error('Error al verificar la autenticación');
                    }

                    if (verifyData.token) localStorage.setItem('jwtToken', verifyData.token);

                    const redirect = urlParams.get('redirect');
                    if (redirect) {
                        const decodedRedirect = decodeURIComponent(redirect);
                        if (decodedRedirect.startsWith('/') && !decodedRedirect.includes('//')) {
                            window.location.href = decodedRedirect;
                            return;
                        }
                    }

                    if (user.role === 'admin' || user.role === 'superadmin') {
                        window.location.href = 'panel-control.html';
                    } else {
                        window.location.href = 'index.html';
                    }

                } else {
                    displayMessage(errorMessageElement, data.error || 'Error en el login.', 'error');
                }
            } catch {
                displayMessage(errorMessageElement, 'Error de conexión con el servidor.', 'error');
            }
        });
    }

    const registerForm = document.querySelector('form[action="/api/auth/register"]');
    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            clearMessages();

            const username = document.getElementById('username').value.trim();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            const confirm = document.getElementById('confirm').value;

            if (!username || !email || !password || !confirm) {
                displayMessage(errorMessageElement, 'Por favor, completa todos los campos.', 'error');
                return;
            }
            if (password !== confirm) {
                displayMessage(errorMessageElement, 'Las contraseñas no coinciden.', 'error');
                return;
            }

            try {
                const response = await fetch('https://projectvechhio.onrender.com/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ username, email, password, confirm })
                });

                const data = await response.json();

                if (response.ok) {
                    const user = data.data.user;
                    const token = data.data.token;
                    localStorage.setItem('jwtToken', token);
                    localStorage.setItem('userRole', user.role);
                    localStorage.setItem('userName', user.username);

                    if (user.role === 'admin' || user.role === 'superadmin') {
                        window.location.href = '/panel-control.html';
                    } else {
                        window.location.href = '/index.html';
                    }
                } else {
                    displayMessage(errorMessageElement, data.error || 'Error en el registro.', 'error');
                }
            } catch {
                displayMessage(errorMessageElement, 'Error de conexión con el servidor.', 'error');
            }
        });
    }
});
