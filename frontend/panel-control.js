import { checkAdminAccess } from './modulos.js';

// Configuración de la API
const API_URL = 'https://projectvechhio.onrender.com/api';

// ============ Funciones para Cargar Vehículos ============
async function loadVehicles() {
    try {
        const token = localStorage.getItem('jwtToken');
        const response = await fetch(`${API_URL}/vehicles`, {
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

function updateVehiclesTable(vehicles) {
    const tbody = document.querySelector('#vehicles-table tbody');
    tbody.innerHTML = '';

    vehicles.forEach(vehicle => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td data-label="Marca">${vehicle.brand}</td>
            <td data-label="Modelo">${vehicle.model}</td>
            <td data-label="Año">${vehicle.year}</td>
            <td data-label="Precio">$${vehicle.price.toLocaleString()}</td>
            <td data-label="Acciones" class="table-actions">
                <button class="btn btn-view" data-id="${vehicle._id}"><i class="fas fa-eye"></i></button>
                <button class="btn btn-edit" data-id="${vehicle._id}"><i class="fas fa-edit"></i></button>
                <button class="btn btn-delete" data-id="${vehicle._id}"><i class="fas fa-trash"></i></button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// ============ Funciones para Cargar Servicios ============
async function loadServices() {
    try {
        const token = localStorage.getItem('jwtToken');
        const response = await fetch(`${API_URL}/services`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Error al cargar servicios');
        }

        const data = await response.json();
        const services = Array.isArray(data) ? data : data.services || [];
        updateServicesTable(services);
    } catch (error) {
        console.error('Error:', error);
        showNotification('Error al cargar los servicios', 'error');
    }
}

function updateServicesTable(services) {
    const tbody = document.querySelector('#services-table tbody');
    tbody.innerHTML = '';

    services.forEach(service => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td data-label="Nombre">${service.type}</td>
            <td data-label="Descripción">${service.description}</td>
            <td data-label="Acciones" class="table-actions">
                <button class="btn btn-view" data-id="${service._id}" data-action="view-service"><i class="fas fa-eye"></i></button>
                <button class="btn btn-edit" data-id="${service._id}" data-action="edit-service"><i class="fas fa-edit"></i></button>
                <button class="btn btn-delete" data-id="${service._id}" data-action="delete-service"><i class="fas fa-trash"></i></button>
            </td>
        `;
        tbody.appendChild(row);
    });

    attachServiceActions();
}

function attachServiceActions() {
    document.querySelectorAll('[data-action="view-service"]').forEach(btn => {
        btn.addEventListener('click', function() {
            const serviceId = this.getAttribute('data-id');
            console.log('Ver servicio:', serviceId);
            showNotification('Funcionalidad de visualización en desarrollo');
        });
    });

    document.querySelectorAll('[data-action="edit-service"]').forEach(btn => {
        btn.addEventListener('click', function() {
            const serviceId = this.getAttribute('data-id');
            openServiceModal(serviceId);
        });
    });

    document.querySelectorAll('[data-action="delete-service"]').forEach(btn => {
        btn.addEventListener('click', function() {
            const serviceId = this.getAttribute('data-id');
            if (confirm('¿Estás seguro de que deseas eliminar este servicio?')) {
                deleteService(serviceId);
            }
        });
    });
}

async function openServiceModal(serviceId) {
    try {
        const token = localStorage.getItem('jwtToken');
        const response = await fetch(`${API_URL}/services/${serviceId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Error al cargar el servicio');
        }

        const service = await response.json();
        
        // Rellenar el formulario con los datos del servicio
        document.getElementById('service-id-input').value = service._id;
        document.getElementById('service-type-select').value = service.type;
        
        // Convertir la fecha a formato datetime-local si existe
        if (service.date) {
            const date = new Date(service.date);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            document.getElementById('service-date-input').value = `${year}-${month}-${day}T${hours}:${minutes}`;
        }
        
        document.getElementById('service-status-select').value = service.status || 'pending';
        
        // Mostrar el modal
        document.getElementById('service-modal').style.display = 'block';
    } catch (error) {
        console.error('Error:', error);
        showNotification('Error al cargar el servicio', 'error');
    }
}

async function deleteService(serviceId) {
    try {
        const token = localStorage.getItem('jwtToken');
        const response = await fetch(`${API_URL}/services/${serviceId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Error al eliminar el servicio');
        }

        showNotification('Servicio eliminado correctamente', 'success');
        loadServices();
    } catch (error) {
        console.error('Error:', error);
        showNotification('Error al eliminar el servicio', 'error');
    }
}

// ============ Funciones para Cargar Finanzas ============
async function loadFinances() {
    try {
        const token = localStorage.getItem('jwtToken');
        const response = await fetch(`${API_URL}/finances`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Error al cargar finanzas');
        }

        const finances = await response.json();
        updateFinancesTable(finances);
    } catch (error) {
        console.error('Error:', error);
        showNotification('Error al cargar las finanzas', 'error');
    }
}

function updateFinancesTable(finances) {
    const tbody = document.querySelector('#finances-table tbody');
    tbody.innerHTML = '';

    if (!finances || finances.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: var(--accent-mint);">No hay solicitudes de financiación</td></tr>';
        return;
    }

    finances.forEach(finance => {
        const row = document.createElement('tr');
        const statusClass = finance.status === 'approved' ? 'status-approved' : 
                          finance.status === 'rejected' ? 'status-rejected' : 'status-pending';
        
        const statusText = finance.status === 'approved' ? 'Aprobada' : 
                         finance.status === 'rejected' ? 'Rechazada' : 'Pendiente';
        
        row.innerHTML = `
            <td data-label="ID">#FIN-${String(finance.id).padStart(3, '0')}</td>
            <td data-label="Cliente">${finance.User?.username || 'N/A'}</td>
            <td data-label="Vehículo">${finance.Vehicle?.brand} ${finance.Vehicle?.model} ${finance.Vehicle?.year}</td>
            <td data-label="Estado"><span class="${statusClass}">${statusText}</span></td>
            <td data-label="Acciones" class="table-actions">
                <button class="btn btn-view" data-id="${finance.id}" data-action="view-finance"><i class="fas fa-eye"></i></button>
                <button class="btn btn-edit" data-id="${finance.id}" data-action="edit-finance"><i class="fas fa-edit"></i></button>
                <button class="btn btn-delete" data-id="${finance.id}" data-action="delete-finance"><i class="fas fa-trash"></i></button>
            </td>
        `;
        tbody.appendChild(row);
    });

    attachFinanceActions();
}

function attachFinanceActions() {
    document.querySelectorAll('[data-action="view-finance"]').forEach(btn => {
        btn.addEventListener('click', function() {
            const financeId = this.getAttribute('data-id');
            console.log('Ver finanza:', financeId);
            showNotification('Funcionalidad de visualización en desarrollo');
        });
    });

    document.querySelectorAll('[data-action="edit-finance"]').forEach(btn => {
        btn.addEventListener('click', function() {
            const financeId = this.getAttribute('data-id');
            openFinanceModal(financeId);
        });
    });

    document.querySelectorAll('[data-action="delete-finance"]').forEach(btn => {
        btn.addEventListener('click', function() {
            const financeId = this.getAttribute('data-id');
            if (confirm('¿Está seguro de que desea eliminar esta solicitud de financiación?')) {
                deleteFinance(financeId);
            }
        });
    });
}

async function openFinanceModal(financeId) {
    const modal = document.getElementById('finance-modal');
    const financeIdInput = document.getElementById('finance-id-input');
    const appointmentDateGroup = document.getElementById('appointment-date-group');

    financeIdInput.value = financeId;
    appointmentDateGroup.style.display = 'none';

    try {
        const token = localStorage.getItem('jwtToken');
        const response = await fetch(`${API_URL}/finances/${financeId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });

        if (response.ok) {
            const finance = await response.json();
            document.getElementById('finance-status-select').value = finance.status || 'received';
        }
    } catch (error) {
        console.error('Error loading finance details:', error);
    }

    modal.style.display = 'block';
}

async function deleteFinance(financeId) {
    try {
        const token = localStorage.getItem('jwtToken');
        const response = await fetch(`${API_URL}/finances/${financeId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });

        if (response.ok) {
            showNotification('Finanza eliminada exitosamente');
            loadFinances();
            loadDashboardStats(); // Recargar estadísticas
        } else {
            throw new Error('Error al eliminar finanza');
        }
    } catch (error) {
        console.error('Error:', error);
        showNotification('Error al eliminar la finanza', 'error');
    }
}

// ============ Funciones para Cargar Usuarios (Solo SuperAdmin) ============
async function loadUsers() {
    try {
        const token = localStorage.getItem('jwtToken');
        const response = await fetch(`${API_URL}/users`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Error al cargar usuarios');
        }

        const users = await response.json();
        updateUsersTable(users);
    } catch (error) {
        console.error('Error:', error);
        showNotification('Error al cargar los usuarios', 'error');
    }
}

function updateUsersTable(users) {
    const tbody = document.querySelector('#users-table tbody');
    tbody.innerHTML = '';

    if (!users || users.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: var(--accent-mint);">No hay usuarios</td></tr>';
        return;
    }

    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td data-label="ID">${user.id}</td>
            <td data-label="Usuario">${user.username}</td>
            <td data-label="Email">${user.email}</td>
            <td data-label="Rol">${user.role}</td>
            <td data-label="Acciones" class="table-actions">
                <button class="btn btn-edit" data-id="${user.id}" data-action="edit-user"><i class="fas fa-edit"></i></button>
                <button class="btn btn-delete" data-id="${user.id}" data-action="delete-user"><i class="fas fa-trash"></i></button>
            </td>
        `;
        tbody.appendChild(row);
    });

    attachUserActions();
}

function attachUserActions() {
    document.querySelectorAll('[data-action="edit-user"]').forEach(btn => {
        btn.addEventListener('click', function() {
            const userId = this.getAttribute('data-id');
            const role = prompt('Ingrese el nuevo rol (user, admin, superadmin):');
            if (role) {
                updateUserRole(userId, role);
            }
        });
    });

    document.querySelectorAll('[data-action="delete-user"]').forEach(btn => {
        btn.addEventListener('click', function() {
            const userId = this.getAttribute('data-id');
            if (confirm('¿Está seguro de que desea eliminar este usuario?')) {
                deleteUser(userId);
            }
        });
    });
}

async function updateUserRole(userId, newRole) {
    try {
        const token = localStorage.getItem('jwtToken');
        const response = await fetch(`${API_URL}/users/${userId}/role`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ role: newRole }),
            credentials: 'include'
        });

        if (response.ok) {
            showNotification('Rol actualizado exitosamente');
            loadUsers();
        } else {
            throw new Error('Error al actualizar rol');
        }
    } catch (error) {
        console.error('Error:', error);
        showNotification('Error al actualizar el rol del usuario', 'error');
    }
}

async function deleteUser(userId) {
    try {
        const token = localStorage.getItem('jwtToken');
        const response = await fetch(`${API_URL}/users/${userId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });

        if (response.ok) {
            showNotification('Usuario eliminado exitosamente');
            loadUsers();
        } else {
            throw new Error('Error al eliminar usuario');
        }
    } catch (error) {
        console.error('Error:', error);
        showNotification('Error al eliminar el usuario', 'error');
    }
}

// ============ Utilidad para mostrar notificaciones ============
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

// ============ Funciones para Cargar Estadísticas ============
async function loadDashboardStats() {
    try {
        const token = localStorage.getItem('jwtToken');
        const response = await fetch(`${API_URL}/statistics/dashboard`, {
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

function updateDashboardStats(data) {
    document.getElementById('totalVehicles').textContent = data.vehicles?.total || 0;
    document.getElementById('newVehicles').textContent = data.vehicles?.new || 0;
    document.getElementById('usedVehicles').textContent = data.vehicles?.used || 0;

    document.getElementById('scheduledServices').textContent = data.services?.scheduled || 0;
    document.getElementById('completedServices').textContent = data.services?.completed || 0;
    document.getElementById('pendingServices').textContent = data.services?.pending || 0;

    document.getElementById('totalFinanceRequests').textContent = data.finances?.total || 0;
    document.getElementById('approvedFinances').textContent = data.finances?.approved || 0;
    document.getElementById('pendingFinances').textContent = data.finances?.pending || 0;
    document.getElementById('rejectedFinances').textContent = data.finances?.rejected || 0;
}

// ============ Funciones de Navegación ============
function showSection(sectionId) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => section.classList.remove('active'));

    const sectionToShow = document.getElementById(sectionId);
    if (sectionToShow) {
        sectionToShow.classList.add('active');
        
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
            case 'users':
                loadUsers();
                break;
            case 'dashboard':
                loadDashboardStats();
                break;
        }
    }

    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// ============ Funciones de Autenticación ============
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

        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', handleLogout);
        }
    }
}

async function handleLogout() {
    try {
        const token = localStorage.getItem('jwtToken');
        await fetch(`${API_URL}/auth/logout`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });
    } catch (error) {
        console.error('Error during logout:', error);
    } finally {
        localStorage.clear();
        window.location.href = 'login.html';
    }
}

async function verifyAuth() {
    try {
        const token = localStorage.getItem('jwtToken');
        if (!token) return false;

        const response = await fetch(`${API_URL}/auth/check`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });

        if (!response.ok) return false;

        const data = await response.json();
        if (data.loggedIn && data.user && ['admin', 'superadmin'].includes(data.user.role)) {
            return true;
        }

        return false;
    } catch (error) {
        console.error('Auth error:', error);
        return false;
    }
}

// ============ Configuración de Marca-Modelo ============
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

// ============ Inicialización ============
document.addEventListener('DOMContentLoaded', async () => {
    // Verificar autenticación
    const isAuthenticated = await verifyAuth();
    if (!isAuthenticated) {
        window.location.href = 'login.html';
        return;
    }

    const userRole = localStorage.getItem('userRole');
    const userName = localStorage.getItem('userName');

    // Actualizar header
    updateHeader(userName);

    // Configurar navegación
    const navLinks = document.querySelectorAll('.nav-link');
    const navUsersLi = document.getElementById('nav-users-li');

    // Solo mostrar usuarios para superadmin
    if (userRole === 'superadmin') {
        navUsersLi.style.display = 'block';
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = link.getAttribute('href').substring(1);
            showSection(sectionId);
            history.pushState(null, null, `#${sectionId}`);
        });
    });

    window.addEventListener('hashchange', () => {
        const hash = window.location.hash.substring(1);
        if (hash) {
            showSection(hash);
        }
    });

    // Configurar selector de marca-modelo
    const brandSelect = document.getElementById('brand');
    const modelSelect = document.getElementById('model');

    if (brandSelect && modelSelect) {
        brandSelect.addEventListener('change', function() {
            const selectedBrand = this.value;
            modelSelect.innerHTML = '<option value="">Seleccione un modelo</option>';
            
            if (selectedBrand && carModels[selectedBrand]) {
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

    // Configurar formulario de vehículos
    const vehicleForm = document.getElementById('add-vehicle-form');
    if (vehicleForm) {
        vehicleForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            try {
                const formData = new FormData(this);
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
                const response = await fetch(`${API_URL}/vehicles`, {
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
                loadVehicles();
                loadDashboardStats(); // Recargar estadísticas después de agregar
            } catch (error) {
                console.error('Error:', error);
                showNotification('Error al agregar el vehículo: ' + error.message, 'error');
            }
        });
    }

    // Configurar modal de finanzas
    const financeModal = document.getElementById('finance-modal');
    const financeCloseBtn = document.querySelector('.close-button');
    const financeForm = document.getElementById('finance-edit-form');
    const financeStatusSelect = document.getElementById('finance-status-select');
    const appointmentDateGroup = document.getElementById('appointment-date-group');

    if (financeCloseBtn) {
        financeCloseBtn.addEventListener('click', () => {
            financeModal.style.display = 'none';
        });
    }

    if (financeStatusSelect) {
        financeStatusSelect.addEventListener('change', () => {
            if (financeStatusSelect.value === 'approved') {
                appointmentDateGroup.style.display = 'block';
            } else {
                appointmentDateGroup.style.display = 'none';
            }
        });
    }

    if (financeForm) {
        financeForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const financeId = document.getElementById('finance-id-input').value;
            const status = financeStatusSelect.value;
            const appointmentDate = document.getElementById('appointment-date-input').value;

            if (status === 'approved' && !appointmentDate) {
                alert('Por favor ingrese una fecha de cita para aprobar la solicitud');
                return;
            }

            try {
                const token = localStorage.getItem('jwtToken');
                const response = await fetch(`${API_URL}/finances/${financeId}/status`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        status: status,
                        appointmentDate: appointmentDate
                    }),
                    credentials: 'include'
                });

                if (response.ok) {
                    showNotification('Estado de finanza actualizado exitosamente');
                    financeModal.style.display = 'none';
                    loadFinances();
                    loadDashboardStats(); // Recargar estadísticas después de actualizar
                } else {
                    throw new Error('Error al actualizar estado');
                }
            } catch (error) {
                console.error('Error:', error);
                showNotification('Error al actualizar el estado de la finanza', 'error');
            }
        });
    }

    // Configurar modal de servicios
    const serviceModal = document.getElementById('service-modal');
    const serviceCloseBtn = document.querySelector('.service-close-button');
    const serviceForm = document.getElementById('service-edit-form');

    if (serviceCloseBtn) {
        serviceCloseBtn.addEventListener('click', () => {
            serviceModal.style.display = 'none';
        });
    }

    if (serviceForm) {
        serviceForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const serviceId = document.getElementById('service-id-input').value;
            const type = document.getElementById('service-type-select').value;
            const date = document.getElementById('service-date-input').value;
            const status = document.getElementById('service-status-select').value;

            if (!date) {
                alert('Por favor ingrese una fecha y hora para el servicio');
                return;
            }

            try {
                const token = localStorage.getItem('jwtToken');
                const response = await fetch(`${API_URL}/services/${serviceId}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        type: type,
                        date: date,
                        status: status
                    }),
                    credentials: 'include'
                });

                if (response.ok) {
                    showNotification('Servicio actualizado exitosamente');
                    serviceModal.style.display = 'none';
                    loadServices();
                } else {
                    throw new Error('Error al actualizar servicio');
                }
            } catch (error) {
                console.error('Error:', error);
                showNotification('Error al actualizar el servicio', 'error');
            }
        });
    }

    // Cerrar modal con click fuera
    window.addEventListener('click', (event) => {
        const financeModal = document.getElementById('finance-modal');
        const serviceModal = document.getElementById('service-modal');
        
        if (event.target === financeModal) {
            financeModal.style.display = 'none';
        }
        if (event.target === serviceModal) {
            serviceModal.style.display = 'none';
        }
    });

    // Cargar sección inicial
    const initialHash = window.location.hash.substring(1);
    showSection(initialHash || 'dashboard');
});
