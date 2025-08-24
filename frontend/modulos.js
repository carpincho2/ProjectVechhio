async function checkLogin() {
    try {
        const token = localStorage.getItem('jwtToken');
        const loginSection = document.getElementById('login-section');
        const userSection = document.getElementById('user-section');
        const userName = document.getElementById('user-name');
        const logoutBtn = document.querySelector('.logout-btn');

        if (!token) {
            // Usuario NO logueado (no hay token)
            loginSection.classList.remove('hidden');
            loginSection.classList.add('d-flex');
            userSection.classList.add('hidden');
            userSection.classList.remove('d-flex');
            return;
        }

        const response = await fetch('/api/auth/check', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            if (data.loggedIn && data.user) {
                // Usuario LOGUEADO y token válido
                loginSection.classList.add('hidden');
                loginSection.classList.remove('d-flex');
                userSection.classList.remove('hidden');
                userSection.classList.add('d-flex');
                userName.textContent = data.user.username || data.user.email || 'User';
            } else {
                // Token inválido o no logueado según el backend
                localStorage.removeItem('jwtToken');
                localStorage.removeItem('userRole');
                localStorage.removeItem('userName');
                loginSection.classList.remove('hidden');
                loginSection.classList.add('d-flex');
                userSection.classList.add('hidden');
                userSection.classList.remove('d-flex');
            }
        } else {
            // Error en la respuesta (ej. 401 Unauthorized, 403 Forbidden)
            localStorage.removeItem('jwtToken');
            localStorage.removeItem('userRole');
            localStorage.removeItem('userName');
            loginSection.classList.remove('hidden');
            loginSection.classList.add('d-flex');
            userSection.classList.add('hidden');
            userSection.classList.remove('d-flex');
            console.error('Error al verificar sesión:', response.status, response.statusText);
        }
    } catch (error) {
        console.error('Error en la solicitud de verificación de sesión:', error);
        // En caso de error de red, asumir no logueado y limpiar token
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userName');
        const loginSection = document.getElementById('login-section');
        const userSection = document.getElementById('user-section');
        if (loginSection) {
            loginSection.classList.remove('hidden');
            loginSection.classList.add('d-flex');
        }
        if (userSection) {
            userSection.classList.add('hidden');
            userSection.classList.remove('d-flex');
        }
    }
}

// Manejar el cierre de sesión desde el botón en el header
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(checkLogin, 100); // Pequeño delay para asegurar

    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('jwtToken');
            localStorage.removeItem('userRole');
            localStorage.removeItem('userName');
            // Opcional: llamar al endpoint de logout del backend si hay lógica de limpieza de cookies/sesiones
            // fetch('/api/auth/logout', { method: 'POST' });
            window.location.href = '/index.html'; // Redirigir a la página principal
        });
    }
});
