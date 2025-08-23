async function checkLogin() {
    try {
        const response = await fetch('/api/auth/check');
        
        if (!response.ok) return;
        
        const data = await response.json();
        const loginSection = document.getElementById('login-section');
        const userSection = document.getElementById('user-section');
        const userName = document.getElementById('user-name');
        
        if (data.loggedIn && data.user) {
            // Usuario LOGUEADO
            loginSection.classList.add('hidden');
            loginSection.classList.remove('d-flex');
            userSection.classList.remove('hidden');
            userSection.classList.add('d-flex');
            // Usar email si no hay username
            userName.textContent = data.user.username || data.user.email || 'User';
        } else {
            // Usuario NO logueado
            loginSection.classList.remove('hidden');
            loginSection.classList.add('d-flex');
            userSection.classList.add('hidden');
            userSection.classList.remove('d-flex');
        }
    } catch (error) {
        console.log('Session check skipped');
        // Mantener login visible por defecto
        document.getElementById('login-section').classList.remove('hidden');
        document.getElementById('login-section').classList.add('d-flex');
    }
}

// Ejecutar al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(checkLogin, 100); // Pequeño delay para asegurar
});
