import { checkAdminAccess } from './modulos.js';

// Configuración de la API
const API_URL = 'https://projectvechhio.onrender.com/api';

// Función para actualizar la UI de autenticación
function updateAuthUI() {
    const token = localStorage.getItem('jwtToken');
    const userName = localStorage.getItem('userName');
    const authContainer = document.getElementById('auth-container');

    if (token && userName) {
        if (authContainer) {
            authContainer.innerHTML = `
                <div class="user-info">
                    <span>Bienvenido, ${userName}</span>
                    <button id="logout-btn" class="btn-logout">
                        <i class="fas fa-sign-out-alt"></i> Cerrar Sesión
                    </button>
                </div>
            `;

            // Agregar evento al botón de logout
            const logoutBtn = document.getElementById('logout-btn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', handleLogout);
            }
        }
    } else {
        if (authContainer) {
            authContainer.innerHTML = `
                <div class="auth-buttons">
                    <a href="login.html" class="btn-login">Iniciar Sesión</a>
                    <a href="register.html" class="btn-register">Registrarse</a>
                </div>
            `;
        }
    }
}

// Función para actualizar el header
function updateHeader(userName) {
    const authContainer = document.getElementById('auth-container');
    if (authContainer) {
        authContainer.innerHTML = `
            <div class="user-auth-section">
                <span class="welcome-text">Bienvenido, ${userName}</span>
                <button id="logout-btn" class="btn-logout">
                    <i class="fas fa-sign-out-alt"></i> Cerrar Sesión
                </button>
            </div>
        `;

        // Agregar evento de logout
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', handleLogout);
        }
    }
}

// Función para manejar el logout
async function handleLogout() {
    try {
        const token = localStorage.getItem('jwtToken');
        const response = await fetch('https://projectvechhio.onrender.com/api/auth/logout', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });

        if (response.ok) {
            localStorage.clear();
            window.location.href = 'login.html';
        }
    } catch (error) {
        console.error('Error during logout:', error);
        localStorage.clear();
        window.location.href = 'login.html';
    }
}

// Función para cargar las estadísticas del dashboard
async function loadDashboardStats() {
    try {
        const token = localStorage.getItem('jwtToken');
        const response = await fetch('https://projectvechhio.onrender.com/api/statistics/dashboard', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });

        if (response.ok) {
            const data = await response.json();
            updateDashboardStats(data);
        }
    } catch (error) {
        console.error('Error loading dashboard stats:', error);
        showNotification('Error al cargar las estadísticas', 'error');
    }
}

// Función para actualizar las estadísticas en el dashboard
function updateDashboardStats(data) {
    // Actualizar estadísticas de vehículos
    document.getElementById('totalVehicles').textContent = data.vehicles?.total || 0;
    document.getElementById('newVehicles').textContent = data.vehicles?.new || 0;
    document.getElementById('usedVehicles').textContent = data.vehicles?.used || 0;

    // Actualizar estadísticas de servicios
    document.getElementById('scheduledServices').textContent = data.services?.scheduled || 0;
    document.getElementById('completedServices').textContent = data.services?.completed || 0;
    document.getElementById('pendingServices').textContent = data.services?.pending || 0;

    // Actualizar estadísticas de finanzas
    document.getElementById('totalFinanceRequests').textContent = data.finances?.total || 0;
    document.getElementById('approvedFinances').textContent = data.finances?.approved || 0;
    document.getElementById('pendingFinances').textContent = data.finances?.pending || 0;
    document.getElementById('rejectedFinances').textContent = data.finances?.rejected || 0;
}

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
    // Verificar autenticación primero
    const isAuthenticated = await verifyAuth();
    if (!isAuthenticated) {
        window.location.href = 'login.html';
        return;
    }

    const userRole = localStorage.getItem('userRole');
    const userName = localStorage.getItem('userName');

    // Actualizar el header con la información del usuario
    updateHeader(userName);

    // Configurar la navegación
    const navLinks = document.querySelectorAll('.nav-link');
    const navUsersLi = document.getElementById('nav-users-li');

    // Solo mostrar la sección de usuarios para superadmin
    if (userRole === 'superadmin') {
        navUsersLi.style.display = 'block';
    }

    // Inicializar las estadísticas del dashboard
    loadDashboardStats();

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
            
            // Inicializar sección específica si es necesario
            if (sectionId === 'finances') {
                initializeFinanceSection();
            }
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
            if (!token) {
                throw new Error('No token found');
            }

            const response = await fetch('https://projectvechhio.onrender.com/api/auth/check', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Auth check failed');
            }

            const data = await response.json();
            if (!data.loggedIn || !data.user || !['admin', 'superadmin'].includes(data.user.role)) {
                throw new Error('Not authorized');
            }

            return true;
        } catch (error) {
            console.error('Auth error:', error);
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

        // Verificar autenticación al cambiar de sección
        window.addEventListener('hashchange', async () => {
            const stillAuthenticated = await verifyAuth();
            if (!stillAuthenticated || !isAdmin()) {
                window.location.href = 'index.html';
                return;
            }
        });

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

    // Función para cargar vehículos
async function loadVehicles() {
    try {
        const token = localStorage.getItem('jwtToken');
        const response = await fetch('https://projectvechhio.onrender.com/api/vehicles', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Error al cargar vehículos');
        }

        const vehicles = await response.json();
        updateVehiclesTable(vehicles);
    } catch (error) {
        console.error('Error:', error);
        showNotification('Error al cargar los vehículos', 'error');
    }
}

// Función para actualizar la tabla de vehículos
function updateVehiclesTable(vehicles) {
    const tbody = document.querySelector('#vehicles-table tbody');
    tbody.innerHTML = '';

    vehicles.forEach(vehicle => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${vehicle.brand}</td>
            <td>${vehicle.model}</td>
            <td>${vehicle.year}</td>
            <td>$${vehicle.price.toLocaleString()}</td>
            <td class="table-actions">
                <button class="btn btn-view" data-id="${vehicle._id}"><i class="fas fa-eye"></i></button>
                <button class="btn btn-edit" data-id="${vehicle._id}"><i class="fas fa-edit"></i></button>
                <button class="btn btn-delete" data-id="${vehicle._id}"><i class="fas fa-trash"></i></button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Función para cargar servicios
async function loadServices() {
    try {
        const token = localStorage.getItem('jwtToken');
        const response = await fetch('https://projectvechhio.onrender.com/api/services', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Error al cargar servicios');
        }

        const services = await response.json();
        updateServicesTable(services);
    } catch (error) {
        console.error('Error:', error);
        showNotification('Error al cargar los servicios', 'error');
    }
}

// Función para actualizar la tabla de servicios
function updateServicesTable(services) {
    const tbody = document.querySelector('#services-table tbody');
    tbody.innerHTML = '';

    services.forEach(service => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${service.type}</td>
            <td>${service.description}</td>
            <td class="table-actions">
                <button class="btn btn-view" data-id="${service._id}"><i class="fas fa-eye"></i></button>
                <button class="btn btn-edit" data-id="${service._id}"><i class="fas fa-edit"></i></button>
                <button class="btn btn-delete" data-id="${service._id}"><i class="fas fa-trash"></i></button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Inicializar el formulario de vehículos
const vehicleForm = document.getElementById('add-vehicle-form');
if (vehicleForm) {
    vehicleForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        try {
            const formData = new FormData(this);
            
            // Validar que todos los campos requeridos estén llenos
            const brand = formData.get('brand');
            const model = formData.get('model');
            const year = formData.get('year');
            const price = formData.get('price');
            const condition = formData.get('condition');

            if (!brand || !model || !year || !price || !condition) {
                showNotification('Por favor complete todos los campos requeridos', 'error');
                return;
            }

            const token = localStorage.getItem('jwtToken');
            
            const response = await fetch('https://projectvechhio.onrender.com/api/vehicles', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData,
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Error al agregar el vehículo');
            }

            showNotification('Vehículo agregado exitosamente');
            this.reset();
            loadVehicles(); // Recargar la lista de vehículos
        } catch (error) {
            console.error('Error:', error);
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

async function initializeFinanceSection() {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
        showNotification('Por favor, inicie sesión para acceder a las finanzas', 'error');
        window.location.href = 'login.html';
        return;
    }

    try {
        const response = await fetch('https://projectvechhio.onrender.com/api/finances', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Error al cargar datos de finanzas');
        }

        // Resto del código para cargar los datos de finanzas...
    } catch (error) {
        console.error('Error:', error);
        if (error.message.includes('401') || error.message.includes('403')) {
            showNotification('Sesión expirada. Por favor, vuelva a iniciar sesión', 'error');
            localStorage.clear();
            window.location.href = 'login.html';
        }
    }
}

// Cargar datos cuando se muestra una sección
function showSection(sectionId) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => section.classList.remove('active'));

    const sectionToShow = document.getElementById(sectionId);
    if (sectionToShow) {
        sectionToShow.classList.add('active');
        
        // Cargar datos específicos de la sección
        switch(sectionId) {
            case 'vehicles':
                loadVehicles();
                break;
            case 'services':
                loadServices();
                break;
            case 'finances':
                loadFinances();
                break;
            case 'dashboard':
                loadDashboardStats();
                break;
        }
    }

    // Actualizar enlaces de navegación
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

initialize();
checkAdminAccessWrapper();
});
