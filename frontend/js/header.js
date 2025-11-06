// Función para cargar el header
async function loadHeader() {
    try {
        const response = await fetch('/components/header.html');
        const headerHtml = await response.text();
        document.body.insertAdjacentHTML('afterbegin', headerHtml);
        initializeHeader();
    } catch (error) {
        console.error('Error loading header:', error);
    }
}

// Función para inicializar la funcionalidad del header
function initializeHeader() {
    const hamburger = document.getElementById('hamburger-btn');
    const navMenu = document.getElementById('nav-menu');
    const authLinks = document.getElementById('auth-links');
    const userLinks = document.getElementById('user-links');
    const adminPanelLink = document.getElementById('admin-panel-link');
    const logoutLink = document.getElementById('logout-link');

    // Toggle menu hamburguesa
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Actualizar UI basado en el estado de autenticación
    updateHeaderAuth();

    // Evento de logout
    if (logoutLink) {
        logoutLink.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    }
}

// Función para actualizar el header basado en la autenticación
function updateHeaderAuth() {
    const authLinks = document.getElementById('auth-links');
    const userLinks = document.getElementById('user-links');
    const adminPanelLink = document.getElementById('admin-panel-link');
    
    const token = localStorage.getItem('jwtToken');
    const userRole = localStorage.getItem('userRole');

    if (token) {
        if (authLinks) authLinks.style.display = 'none';
        if (userLinks) userLinks.style.display = 'flex';
        if (adminPanelLink) {
            adminPanelLink.style.display = 
                (userRole === 'admin' || userRole === 'superadmin') ? 'block' : 'none';
        }
    } else {
        if (authLinks) authLinks.style.display = 'flex';
        if (userLinks) userLinks.style.display = 'none';
    }
}

// Función de logout
function logout() {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    window.location.href = '/index.html';
}

// Verificar autenticación periódicamente
setInterval(checkAuthAndUpdate, 60000); // Cada minuto

// Función para verificar autenticación
async function checkAuthAndUpdate() {
    try {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
            updateHeaderAuth();
            return;
        }

        const response = await fetch('https://projectvechhio.onrender.com/api/auth/check', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            // Si hay error, limpiar localStorage y actualizar UI
            localStorage.removeItem('jwtToken');
            localStorage.removeItem('userName');
            localStorage.removeItem('userRole');
            updateHeaderAuth();
            
            // Redirigir a login si estamos en una página protegida
            const protectedPages = ['/panel-control.html', '/profile.html', '/admin-finances.html', 
                                 '/admin-services.html', '/admin-vehicles.html', '/finance.html'];
            if (protectedPages.includes(window.location.pathname)) {
                window.location.href = '/login.html?redirect=' + encodeURIComponent(window.location.pathname);
            }
        }
    } catch (error) {
        console.error('Error checking auth:', error);
    }
}

// Cargar el header cuando el documento esté listo
document.addEventListener('DOMContentLoaded', loadHeader);

// Exportar funciones que puedan necesitar otros módulos
export { updateHeaderAuth, checkAuthAndUpdate };