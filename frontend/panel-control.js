import { checkAdminAccess } from './modulos.js';

const carModels = {
    Toyota: ['Corolla', 'Camry', 'RAV4', 'Hilux', 'Yaris', 'Land Cruiser', 'Prius'],
    Mercedes: ['Clase A', 'Clase C', 'Clase E', 'Clase S', 'GLA', 'GLC', 'AMG GT'],
    Lexus: ['IS', 'ES', 'LS', 'UX', 'NX', 'RX', 'LX'],
    Ford: ['Fiesta', 'Focus', 'Mustang', 'Explorer', 'F-150', 'Ranger', 'Escape'],
    Honda: ['Civic', 'Accord', 'CR-V', 'HR-V', 'Pilot', 'Fit', 'Odyssey'],
    Mclaren: ['720S', '570S', 'GT', 'Artura', 'P1', '765LT', '600LT'],
    Peugeot: ['208', '2008', '308', '3008', '5008', '508', 'Partner'],
    Fiat: ['500', 'Panda', 'Tipo', 'Argo', 'Cronos', 'Toro', 'Strada']
};

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

    // Manejador para el selector de marca
    const brandSelect = document.getElementById('brand');
    const modelSelect = document.getElementById('model');

    if (brandSelect && modelSelect) {
        brandSelect.addEventListener('change', function() {
            const selectedBrand = this.value;
            // Limpiar el selector de modelos
            modelSelect.innerHTML = '<option value="">Seleccione un modelo</option>';
            
            if (selectedBrand && carModels[selectedBrand]) {
                // Agregar los modelos correspondientes a la marca seleccionada
                carModels[selectedBrand].forEach(model => {
                    const option = document.createElement('option');
                    option.value = model;
                    option.textContent = model;
                    modelSelect.appendChild(option);
                });
                modelSelect.disabled = false;
            } else {
                modelSelect.disabled = true;
            }
        });
    }

    // Inicializar el formulario de vehículos
    const vehicleForm = document.getElementById('add-vehicle-form');
    if (vehicleForm) {
        vehicleForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            try {
                const formData = new FormData(this);
                const token = localStorage.getItem('jwtToken');
                
                const response = await fetch('https://projectvechhio.onrender.com/api/vehicles', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    body: formData
                });

                if (response.ok) {
                    // Mostrar notificación de éxito
                    showNotification('Vehículo agregado exitosamente');
                    // Limpiar el formulario
                    vehicleForm.reset();
                    // Recargar la lista de vehículos
                    loadVehicles();
                } else {
                    throw new Error('Error al agregar el vehículo');
                }
            } catch (error) {
                showNotification('Error al agregar el vehículo: ' + error.message, 'error');
            }
        });
    }

    // Función para mostrar notificaciones
    function showNotification(message, type = 'success') {
        const notification = document.getElementById('notification');
        const notificationText = document.getElementById('notification-text');
        
        if (notification && notificationText) {
            notificationText.textContent = message;
            notification.className = `notification ${type}`;
            notification.style.display = 'block';
            
            setTimeout(() => {
                notification.style.display = 'none';
            }, 3000);
        }
    }

    initialize();
    checkAdminAccessWrapper();
});
