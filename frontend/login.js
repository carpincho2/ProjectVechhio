document.addEventListener('DOMContentLoaded', function() {
    const errorMessageElement = document.getElementById('errorMessage');
    const successMessageElement = document.getElementById('successMessage');
    
    // Function to display a message
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

    // Function to clear messages
    function clearMessages() {
        errorMessageElement.textContent = '';
        errorMessageElement.style.display = 'none';
        errorMessageElement.classList.remove('error', 'success');

        successMessageElement.textContent = '';
        successMessageElement.style.display = 'none';
        successMessageElement.classList.remove('error', 'success');
    }
    
    // Check for messages from URL parameters (e.g., after registration redirect)
    const urlParams = new URLSearchParams(window.location.search);
    const errorParam = urlParams.get('error');
    const successParam = urlParams.get('success');

    if (errorParam) {
        displayMessage(errorMessageElement, decodeURIComponent(errorParam), 'error');
    }
    if (successParam) {
        displayMessage(successMessageElement, decodeURIComponent(successParam), 'success');
    }

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) { // Added async
            e.preventDefault(); // Prevent default form submission
            clearMessages(); // Clear previous messages on submit

            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value;
            
            if (!username || !password) {
                displayMessage(errorMessageElement, 'Por favor, completa todos los campos.', 'error');
                return;
            }

            try {
                // Limpiar cualquier token anterior
                localStorage.removeItem('jwtToken');
                localStorage.removeItem('userRole');
                localStorage.removeItem('userName');

                const response = await fetch('https://projectvechhio.onrender.com/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, password })
                });

                const data = await response.json();

                if (response.ok) {
                    localStorage.setItem('jwtToken', data.token);
                    localStorage.setItem('userRole', data.user.role);
                    localStorage.setItem('userName', data.user.username);
                    
                    // Verificar que el login fue exitoso antes de continuar
                    const urlParams = new URLSearchParams(window.location.search);
                    const redirect = urlParams.get('redirect');
                    
                    // Verificar autenticación inmediatamente después de login
                    const verifyResponse = await fetch('https://projectvechhio.onrender.com/api/auth/check', {
                        headers: {
                            'Authorization': `Bearer ${data.token}`
                        }
                    });
                    
                    if (!verifyResponse.ok) {
                        throw new Error('Error al verificar la autenticación');
                    }

                    // Redirigir al destino original si existe, si no redirigir por rol
                    if (redirect) {
                        try {
                            const decodedRedirect = decodeURIComponent(redirect);
                            // Verificar que la URL de redirección es válida
                            if (decodedRedirect.startsWith('/') && !decodedRedirect.includes('//')) {
                                window.location.href = decodedRedirect;
                            } else {
                                // Si la URL no es válida, redirigir según el rol
                                if (data.user.role === 'admin' || data.user.role === 'superadmin') {
                                    window.location.href = '/panel-control.html';
                                } else {
                                    window.location.href = '/index.html';
                                }
                            }
                        } catch (e) {
                            if (data.user.role === 'admin' || data.user.role === 'superadmin') {
                                window.location.href = '/panel-control.html';
                            } else {
                                window.location.href = '/index.html';
                            }
                        }
                    } else {
                        // Redirect based on role
                        if (data.user.role === 'admin' || data.user.role === 'superadmin') {
                            window.location.href = '/panel-control.html';
                        }
                        else {
                            window.location.href = '/index.html';
                        }
                    }
                } else {
                    displayMessage(errorMessageElement, data.error || 'Error en el login.', 'error');
                }
            } catch (error) {
                displayMessage(errorMessageElement, 'Error de conexión con el servidor.', 'error');
            }
        });
    }

    // Handle registration form submission if it's on the same page (unlikely but for completeness)
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
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify({ username, email, password, confirm })
                });

                const data = await response.json();

                if (response.ok) {
                    localStorage.setItem('jwtToken', data.token);
                    localStorage.setItem('userRole', data.user.role);
                    localStorage.setItem('userName', data.user.username);
                    // Redirect after successful registration
                    if (data.user.role === 'admin' || data.user.role === 'superadmin') {
                        window.location.href = '/panel-control.html';
                    } else {
                        window.location.href = '/index.html';
                    }
                } else {
                    displayMessage(errorMessageElement, data.error || 'Error en el registro.', 'error');
                }
            } catch (error) {
                displayMessage(errorMessageElement, 'Error de conexión con el servidor.', 'error');
            }
        });
    }
});