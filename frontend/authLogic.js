import { checkLogin } from './modulos.js';

function updateAuthUI() {
    const token = localStorage.getItem('jwtToken');
    const userName = localStorage.getItem('userName');
    const loginLink = document.getElementById('login-link');
    const registerLink = document.getElementById('register-link');

    if (token && userName) {
        // Usuario logueado
        if (loginLink) loginLink.style.display = 'none';
        if (registerLink) registerLink.style.display = 'none';
        
        const authContainer = document.getElementById('auth-container');
        if (authContainer) {
            authContainer.innerHTML = `
                <div id="user-section">
                    <span class="welcome-text">Hi, ${userName}</span>
                    <a href="/profile.html" class="auth-link">Profile</a>
                    <a href="#" id="logout-btn" class="auth-link">Logout</a>
                </div>
            `;
            const logoutBtn = document.getElementById('logout-btn');
            if(logoutBtn) {
                logoutBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    localStorage.removeItem('jwtToken');
                    localStorage.removeItem('userName');
                    localStorage.removeItem('userRole');
                    window.location.reload();
                });
            }
        }
    } else {
        // Usuario NO logueado
        if (loginLink) loginLink.style.display = 'inline-block';
        if (registerLink) registerLink.style.display = 'inline-block';
    }
}

export async function handleAuthInitialization() {
    const isLoggedIn = await checkLogin();
    if (isLoggedIn) {
        updateAuthUI();
        return true;
    } else {
        // Solo limpiamos el localStorage si realmente no está autenticado
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userName');
        updateAuthUI();
        return false;
    }
}

// Inicializar la verificación de autenticación al cargar la página
export async function requireAuth() {
    const isLoggedIn = await checkLogin();
    if (!isLoggedIn) {
        window.location.href = '/login.html?redirect=' + encodeURIComponent(window.location.pathname);
        return false;
    }
    return true;
}

document.addEventListener('DOMContentLoaded', async () => {
    // Verificar autenticación y actualizar UI
    const isLoggedIn = await handleAuthInitialization();
    
    // Verificar si estamos en una página protegida
    const protectedPages = ['/panel-control.html', '/profile.html', '/admin-finances.html', 
                          '/admin-services.html', '/admin-vehicles.html', '/finance.html'];
    
    if (protectedPages.includes(window.location.pathname) && !isLoggedIn) {
        window.location.href = '/login.html?redirect=' + encodeURIComponent(window.location.pathname);
    }
});

// Verificar cuando la página se hace visible nuevamente
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        handleAuthInitialization();
    }
});
