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
    await checkLogin();
    updateAuthUI();
}
