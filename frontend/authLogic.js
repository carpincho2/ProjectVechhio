import { checkLogin } from './modulos.js';

function updateAuthHeader() {
    const token = localStorage.getItem('jwtToken');
    const userName = localStorage.getItem('userName');
    const authContainer = document.getElementById('auth-container');

    if (token && userName) {
        // Usuario logueado
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
    } else {
        // Usuario NO logueado
        authContainer.innerHTML = `
            <div id="login-section">
                <a href="login.html" class="auth-link">Login</a>
                <a href="register.html" class="auth-link">Register</a>
            </div>
        `;
    }
}

export async function handleAuthInitialization() {
    await checkLogin();
    updateAuthHeader();
}

// Event listener para el botón de Google Sign-In
const googleSignInBtn = document.getElementById('google-signin-btn');
if (googleSignInBtn) {
    googleSignInBtn.addEventListener('click', function() {
        // Redirigir al endpoint de autenticación de Google en el backend
        window.location.href = '/api/auth/google';
    });
}
