import { checkAdminAccess } from './modulos.js';

document.addEventListener('DOMContentLoaded', async () => {
    const navLinks = document.querySelectorAll('.nav-link');
    const navUsersLi = document.getElementById('nav-users-li');
    const userRole = localStorage.getItem('userRole');
    const userName = localStorage.getItem('userName');
    const userDisplay = document.getElementById('userDisplay');

    // Add click event listeners to navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = link.getAttribute('href').substring(1);
            showSection(sectionId);
            // Update URL hash without scrolling
            history.pushState(null, null, `#${sectionId}`);
        });
    });

    // Handle initial page load and browser back/forward
    window.addEventListener('hashchange', () => {
        const hash = window.location.hash.substring(1);
        if (hash) {
            showSection(hash);
        }
    });

    if (userDisplay && userName) {
        userDisplay.textContent = userName;
    }

    function showSection(sectionId) {
        // Remover la clase active de todas las secciones
        const sections = document.querySelectorAll('.section');
        sections.forEach(section => section.classList.remove('active'));

        // Remover la clase active de todos los enlaces
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => link.classList.remove('active'));

        // Activar la sección seleccionada
        const sectionToShow = document.getElementById(sectionId);
        if (sectionToShow) {
            sectionToShow.classList.add('active');
        }

        // Activar el enlace correspondiente
        const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }

    function isAdmin() {
        return userRole === 'admin' || userRole === 'superadmin';
    }

    async function verifyAuth() {
        try {
            const token = localStorage.getItem('jwtToken');
            if (!token) return false;

            const response = await fetch('https://projectvechhio.onrender.com/api/auth/check', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                return data.loggedIn && data.user;
            }

            localStorage.clear();
            return false;
        } catch {
            localStorage.clear();
            return false;
        }
    }

    async function fetchDashboardCounts() {
        try {
            const token = localStorage.getItem('jwtToken');
            const response = await fetch('https://projectvechhio.onrender.com/api/statistics/dashboard', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            const usersCount = document.getElementById('usersCount');
            const vehiclesCount = document.getElementById('vehiclesCount');
            const servicesCount = document.getElementById('servicesCount');
            const financesCount = document.getElementById('financesCount');
            
            if (usersCount) usersCount.textContent = data.users || 0;
            if (vehiclesCount) vehiclesCount.textContent = data.vehicles || 0;
            if (servicesCount) servicesCount.textContent = data.services || 0;
            if (financesCount) financesCount.textContent = data.finances || 0;
            
        } catch (error) {
            console.error('Error cargando los datos del dashboard:', error);
            // Show error message to user
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.textContent = 'Error al cargar los datos del dashboard. Por favor, intente nuevamente.';
            const dashboard = document.getElementById('dashboard');
            if (dashboard) {
                dashboard.insertBefore(errorDiv, dashboard.firstChild);
                // Remove error message after 5 seconds
                setTimeout(() => errorDiv.remove(), 5000);
            }
        }
    }

    async function initialize() {
        const isAuthenticated = await verifyAuth();

        if (!isAuthenticated || !isAdmin()) {
            window.location.href = 'index.html';
            return;
        }

        const hash = window.location.hash.substring(1);
        showSection(hash || 'dashboard');

        if (userRole === 'superadmin') {
            navUsersLi.style.display = 'block';
        } else {
            navUsersLi.style.display = 'none';
        }

        fetchDashboardCounts();
    }

    async function checkAdminAccessWrapper() {
        const isAuthenticated = await checkAdminAccess();
        if (!isAuthenticated) {
            window.location.href = 'index.html';
        }
    }

    navLinks.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const target = e.target.getAttribute('href').substring(1);
            showSection(target);
            window.location.hash = target;
        });
    });

    initialize();
    checkAdminAccessWrapper();
});
