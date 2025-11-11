// Función para cargar el header dinámicamente
async function loadHeader() {
    try {
        const response = await fetch('/components/header.html');
        const headerHtml = await response.text();
        document.body.insertAdjacentHTML('afterbegin', headerHtml);
        initializeHeader();
    } catch (error) {
        // Si falla al cargar el header, continuar sin él
        console.error('Error loading header:', error);
    }
}

// Función para inicializar la funcionalidad del header
function initializeHeader() {
    const hamburger = document.getElementById('hamburger-btn');
    const navMenu = document.getElementById('nav-menu');
    const logoutLink = document.getElementById('logout-link');

    // Toggle del menú hamburguesa en mobile
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Actualizar UI según estado de autenticación
    updateHeaderAuth();

    // Evento de logout
    if (logoutLink) {
        logoutLink.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    }
}

// Actualizar el header según si el usuario está autenticado
function updateHeaderAuth() {
    const authLinks = document.getElementById('auth-links');
    const userLinks = document.getElementById('user-links');
    const adminPanelLink = document.getElementById('admin-panel-link');
    
    const token = localStorage.getItem('jwtToken');
    const userRole = localStorage.getItem('userRole');

    if (token) {
        // Usuario autenticado: mostrar links de usuario
        if (authLinks) authLinks.style.display = 'none';
        if (userLinks) userLinks.style.display = 'flex';
        // Mostrar panel admin solo si es admin/superadmin
        if (adminPanelLink) {
            adminPanelLink.style.display = 
                (userRole === 'admin' || userRole === 'superadmin') ? 'block' : 'none';
        }
    } else {
        // Usuario no autenticado: mostrar links de login/registro
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

// Verificar autenticación periódicamente (cada minuto)
setInterval(checkAuthAndUpdate, 60000);

// Verificar si el token sigue siendo válido
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
            // Token inválido: limpiar localStorage y redirigir si es necesario
            localStorage.removeItem('jwtToken');
            localStorage.removeItem('userName');
            localStorage.removeItem('userRole');
            updateHeaderAuth();
            
            // Redirigir a login si estamos en página protegida
            const protectedPages = ['/panel-control.html', '/profile.html', '/admin-finances.html', 
                                 '/admin-services.html', '/admin-vehicles.html', '/finance.html'];
            if (protectedPages.includes(window.location.pathname)) {
                window.location.href = '/login.html?redirect=' + encodeURIComponent(window.location.pathname);
            }
        }
    } catch (error) {
        // No hacer nada si falla la verificación (puede ser conectividad)
    }
}

// Cargar el header cuando el documento esté listo
document.addEventListener('DOMContentLoaded', loadHeader);

// Exportar funciones que otros módulos puedan usar
export { updateHeaderAuth, checkAuthAndUpdate };