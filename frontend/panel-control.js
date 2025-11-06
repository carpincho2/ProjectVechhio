import { verifyAuth, isAdmin } from './auth.js';

document.addEventListener('DOMContentLoaded', async () => {
    // Verificar acceso de administrador
    const hasAccess = await checkAdminAccess();
    if (!hasAccess) return;
    // --- ELEMENTOS DEL DOM ---
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    const logoutLinks = document.querySelectorAll('a[href="/logout"]');
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notification-text');

    // Modal de Finanzas
    const financeModal = document.getElementById('finance-modal');
    const financeEditForm = document.getElementById('finance-edit-form');
    const financeIdInput = document.getElementById('finance-id-input');
    const financeStatusSelect = document.getElementById('finance-status-select');
    const appointmentDateGroup = document.getElementById('appointment-date-group');
    const appointmentDateInput = document.getElementById('appointment-date-input');
    const closeModalButton = document.querySelector('.close-button');

    // Modal de Servicios
    const serviceModal = document.getElementById('service-modal');
    const serviceEditForm = document.getElementById('service-edit-form');
    const serviceIdInput = document.getElementById('service-id-input');
    const serviceTypeSelect = document.getElementById('service-type-select');
    const serviceDateInput = document.getElementById('service-date-input');
    const serviceStatusSelect = document.getElementById('service-status-select');
    const serviceCloseButton = document.querySelector('.service-close-button');

    // Forms
    const addVehicleForm = document.getElementById('add-vehicle-form');

    // --- MODELOS POR MARCA ---
    const brandModels = {
        Toyota: ["Aygo X", "bZ4X", "C-HR", "Camry", "Corolla", "Corolla Cross", "Yaris", "GR Yaris", "4Runner", "Crown", "RAV4", "Tacoma", "Tundra"],
        Mercedes: ["Clase A", "Clase B", "Clase C", "Clase E", "Clase G", "Clase S", "CLA", "GLA", "GLB", "GLC", "GLE", "GLS", "AMG GT", "AMG SL"],
        Lexus: ["CT", "ES", "LBX", "LM", "LS", "NX", "RX", "RZ", "UX"],
        Ford: ["Bronco", "Capri", "Explorer", "Focus", "Kuga", "Mustang", "Mustang Mach-E", "Puma", "Tourneo Custom", "Fiesta", "Mondeo", "EcoSport", "Edge"],
        Honda: ["Accord", "Civic", "CR-V", "e:Ny1", "HR-V", "Jazz", "ZR-V", "City", "Civic Type R"],
        Mclaren: ["540C", "570S", "600LT", "650S", "720S", "750S", "765LT", "Artura", "Solus GT"],
        Peugeot: ["208", "308", "2008", "3008", "5008"],
        Fiat: ["500", "600", "Panda", "Tipo", "Topolino", "Doblò", "Ducato", "Scudo"]
    };

    const brandSelectAdmin = document.querySelector('#add-vehicle-form select[name="brand"]');
    const modelSelectAdmin = document.querySelector('#add-vehicle-form select[name="model"]');

    function updateModelOptionsAdmin() {
        const selectedBrand = brandSelectAdmin.value;
        modelSelectAdmin.innerHTML = '<option value="">Modelo</option>';
        if (brandModels[selectedBrand]) {
            brandModels[selectedBrand].forEach(model => {
                const option = document.createElement('option');
                option.value = model;
                option.textContent = model;
                modelSelectAdmin.appendChild(option);
            });
        }
    }

    if (brandSelectAdmin && modelSelectAdmin) {
        brandSelectAdmin.addEventListener('change', updateModelOptionsAdmin);
        updateModelOptionsAdmin();
    }

    // Table Bodies
    const vehiclesTableBody = document.querySelector('#vehicles-table tbody');
    const servicesTableBody = document.querySelector('#services-table tbody');
    const financesTableBody = document.querySelector('#finances-table tbody');
    const usersTableBody = document.querySelector('#users-table tbody');

    const navUsersLi = document.getElementById('nav-users-li');

    // --- ESTADO DE LA APP ---
    const token = localStorage.getItem('jwtToken');
    const userRole = localStorage.getItem('userRole');
    let financesData = []; // Cache para los datos de finanzas
    let servicesData = []; // Cache para servicios

    function parseJwt(token) {
        try {
            return JSON.parse(atob(token.split('.')[1]));
        } catch (e) {
            return null;
        }
    }
    const loggedInUserId = token ? parseJwt(token).id : null;

    // --- FUNCIONES ---

    function showNotification(message, isSuccess = true) {
        notificationText.textContent = message;
        notification.style.backgroundColor = isSuccess ? '#28a745' : '#dc3545';
        notification.classList.add('show');
        setTimeout(() => notification.classList.remove('show'), 3000);
    }

    function showSection(sectionId) {
        sections.forEach(section => section.classList.remove('active'));
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
        }
        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${sectionId}`);
        });
        window.history.replaceState(null, null, `#${sectionId}`);
        window.scrollTo(0, 0);
        switch (sectionId) {
            case 'dashboard': fetchDashboardCounts(); break;
            case 'vehicles': fetchVehicles(); break;
            case 'services': fetchServices(); break;
            case 'finances': fetchFinances(); break;
            case 'users': fetchUsers(); break;
        }
    }

    // --- FUNCIONES DE FETCH ---

    async function fetchVehicles() {
        try {
            const response = await fetch('/api/vehicles', { headers: { 'Authorization': `Bearer ${token}` } });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const vehicles = await response.json();
            vehiclesTableBody.innerHTML = '';
            vehicles.forEach(vehicle => {
                const row = vehiclesTableBody.insertRow();
                row.innerHTML = `
                    <td>${vehicle.brand}</td>
                    <td>${vehicle.model}</td>
                    <td>${vehicle.year}</td>
                    <td>${vehicle.price.toFixed(2)}</td>
                    <td class="table-actions">
                        <button class="btn btn-view" data-id="${vehicle.id}"><i class="fas fa-eye"></i></button>
                        <button class="btn btn-edit" data-id="${vehicle.id}"><i class="fas fa-edit"></i></button>
                        <button class="btn btn-delete" data-id="${vehicle.id}"><i class="fas fa-trash"></i></button>
                    </td>
                `;
            });
            attachActionButtonListeners();
        } catch (error) {
            showNotification('Error al cargar vehículos.', false);
        }
    }

    async function fetchServices() {
        try {
            const response = await fetch('/api/services', { headers: { 'Authorization': `Bearer ${token}` } });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const result = await response.json();
            const services = Array.isArray(result) ? result : (result.data || []);
            servicesData = services; // guardar en cache
            servicesTableBody.innerHTML = '';
            services.forEach(service => {
                const row = servicesTableBody.insertRow();
                row.innerHTML = `
                    <td>${service.type}</td>
                    <td>${new Date(service.date).toLocaleString()}</td>
                    <td>${service.status}</td>
                    <td class="table-actions">
                        <button class="btn btn-view" data-id="${service.id}"><i class="fas fa-eye"></i></button>
                        <button class="btn btn-edit" data-id="${service.id}"><i class="fas fa-edit"></i></button>
                        <button class="btn btn-delete" data-id="${service.id}"><i class="fas fa-trash"></i></button>
                    </td>
                `;
            });
            attachActionButtonListeners();
        } catch (error) {
            showNotification('Error al cargar servicios.', false);
        }
    }

    async function fetchFinances() {
        try {
            const response = await fetch('/api/finances', { headers: { 'Authorization': `Bearer ${token}` } });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            financesData = await response.json();
            financesTableBody.innerHTML = '';
            financesData.forEach(finance => {
                const row = financesTableBody.insertRow();
                row.innerHTML = `
                    <td>${finance.id}</td>
                    <td>${finance.User ? finance.User.username : 'N/A'}</td>
                    <td>${finance.Vehicle ? `${finance.Vehicle.brand} ${finance.Vehicle.model}` : 'N/A'}</td>
                    <td><span class="status-${finance.status.toLowerCase()}">${finance.status}</span></td>
                    <td class="table-actions">
                        <button class="btn btn-view" data-id="${finance.id}"><i class="fas fa-eye"></i></button>
                        <button class="btn btn-edit" data-id="${finance.id}"><i class="fas fa-edit"></i></button>
                        <button class="btn btn-delete" data-id="${finance.id}"><i class="fas fa-trash"></i></button>
                    </td>
                `;
            });
            attachActionButtonListeners();
        } catch (error) {
            showNotification(`Error al cargar finanzas: ${error.message}`, false);
        }
    }

    async function fetchUsers() {
        if (userRole !== 'superadmin') return;
        try {
            const response = await fetch('/api/users', { headers: { 'Authorization': `Bearer ${token}` } });
            if (!response.ok) throw new Error('No se pudo obtener la lista de usuarios.');
            const users = await response.json();
            usersTableBody.innerHTML = '';
            users.forEach(user => {
                const row = usersTableBody.insertRow();
                const isCurrentUser = user.id === loggedInUserId;
                row.innerHTML = `
                    <td>${user.id}</td>
                    <td>${user.username}</td>
                    <td>${user.email}</td>
                    <td>${user.role}</td>
                    <td class="table-actions">
                        <select class="role-select" data-user-id="${user.id}" ${isCurrentUser ? 'disabled' : ''}>
                            <option value="user" ${user.role === 'user' ? 'selected' : ''}>User</option>
                            <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Admin</option>
                            <option value="superadmin" ${user.role === 'superadmin' ? 'selected' : ''}>Superadmin</option>
                        </select>
                        <button class="btn btn-save-role" data-user-id="${user.id}" ${isCurrentUser ? 'disabled' : ''}>Guardar</button>
                        <button class="btn btn-delete btn-delete-user" data-user-id="${user.id}" ${isCurrentUser ? 'disabled' : ''}><i class="fas fa-trash"></i></button>
                    </td>
                `;
            });
        } catch (error) {
            showNotification(error.message, false);
        }
    }

    async function fetchDashboardCounts() {
        try {
            const headers = { 'Authorization': `Bearer ${token}` };
            const [vehiclesRes, servicesRes, financesRes] = await Promise.all([
                fetch('/api/statistics/vehicles', { headers }),
                fetch('/api/statistics/services', { headers }),
                fetch('/api/statistics/finances', { headers })
            ]);

            if (vehiclesRes.ok) {
                const stats = await vehiclesRes.json();
                document.getElementById('totalVehicles').textContent = stats.total || 0;
                document.getElementById('newVehicles').textContent = stats.new || 0;
                document.getElementById('usedVehicles').textContent = stats.used || 0;
            } else {
                document.getElementById('totalVehicles').textContent = 'Error';
            }

            if (servicesRes.ok) {
                const stats = await servicesRes.json();
                document.getElementById('scheduledServices').textContent = stats.scheduled || 0;
                document.getElementById('completedServices').textContent = stats.completed || 0;
                document.getElementById('pendingServices').textContent = stats.pending || 0;
            } else {
                document.getElementById('scheduledServices').textContent = 'Error';
            }

            if (financesRes.ok) {
                const stats = await financesRes.json();
                document.getElementById('totalFinanceRequests').textContent = stats.total || 0;
                document.getElementById('approvedFinances').textContent = stats.approved || 0;
                document.getElementById('pendingFinances').textContent = stats.pending || 0;
                document.getElementById('rejectedFinances').textContent = stats.rejected || 0;
            } else {
                document.getElementById('totalFinanceRequests').textContent = 'Error';
            }
        } catch (error) {
            const statsErrorDiv = document.getElementById('stats-error');
            if (statsErrorDiv) {
                statsErrorDiv.textContent = 'Hubo un error general al cargar las estadísticas.';
                statsErrorDiv.style.display = 'block';
            }
        }
    }

    // --- LÓGICA DEL MODAL DE FINANZAS ---
    function openFinanceModal(finance) {
        financeIdInput.value = finance.id;
        financeStatusSelect.value = finance.status;
        if (finance.status === 'approved' && finance.appointmentDate) {
            appointmentDateInput.value = new Date(finance.appointmentDate).toISOString().slice(0, 16);
            appointmentDateGroup.style.display = 'block';
        } else {
            appointmentDateInput.value = '';
            appointmentDateGroup.style.display = 'none';
        }
        financeModal.style.display = 'block';
    }

    function closeFinanceModal() {
        financeModal.style.display = 'none';
    }

    financeStatusSelect.addEventListener('change', (e) => {
        appointmentDateGroup.style.display = e.target.value === 'approved' ? 'block' : 'none';
    });

    closeModalButton.addEventListener('click', closeFinanceModal);
    window.addEventListener('click', (e) => {
        if (e.target === financeModal) {
            closeFinanceModal();
        }
    });

    financeEditForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = financeIdInput.value;
        const status = financeStatusSelect.value;
        const appointmentDate = appointmentDateInput.value;

        if (status === 'approved' && !appointmentDate) {
            showNotification('La fecha de la cita es obligatoria para aprobar.', false);
            return;
        }

        try {
            const response = await fetch(`/api/finances/${id}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status, appointmentDate })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            showNotification('Estado de la financiación actualizado.');
            closeFinanceModal();
            fetchFinances();
            fetchDashboardCounts();
        } catch (error) {
            showNotification(`Error: ${error.message}`, false);
        }
    });

    // --- LÓGICA DEL MODAL DE SERVICIOS ---
    function openServiceModal(service) {
        serviceIdInput.value = service.id;
        serviceTypeSelect.value = service.type;
        // fecha en ISO para datetime-local
        serviceDateInput.value = service.date ? new Date(service.date).toISOString().slice(0,16) : '';
        serviceStatusSelect.value = service.status || 'scheduled';
        serviceModal.style.display = 'block';
    }

    function closeServiceModal() {
        serviceModal.style.display = 'none';
    }

    serviceCloseButton.addEventListener('click', closeServiceModal);
    window.addEventListener('click', (e) => {
        if (e.target === serviceModal) closeServiceModal();
    });

    // Actualizar servicio
    serviceEditForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = serviceIdInput.value;
        const type = serviceTypeSelect.value;
        const date = serviceDateInput.value;
        const status = serviceStatusSelect.value;

        if (!type || !date) {
            showNotification('Tipo y fecha son obligatorios.', false);
            return;
        }

        // Fecha futura validación
        if (new Date(date) < new Date()) {
            showNotification('La fecha debe ser futura.', false);
            return;
        }

        try {
            const response = await fetch(`/api/services/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ type, date, status })
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error || `HTTP error ${response.status}`);
            }

            showNotification('Servicio actualizado correctamente.');
            closeServiceModal();
            fetchServices();
            fetchDashboardCounts();
        } catch (error) {
            showNotification(`Error: ${error.message}`, false);
        }
    });

    // --- MANEJO DE EVENTOS ---

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            showSection(targetId);
        });
    });

    logoutLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.clear();
            showNotification('Sesión cerrada correctamente');
            setTimeout(() => window.location.href = 'index.html', 1000);
        });
    });

    if (addVehicleForm) {
        addVehicleForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(addVehicleForm);
            try {
                const response = await fetch('/api/vehicles', { method: 'POST', body: formData, headers: { 'Authorization': `Bearer ${token}` } });
                if (!response.ok) throw new Error((await response.json()).error);
                showNotification('Vehículo añadido correctamente');
                addVehicleForm.reset();
                fetchVehicles();
            } catch (error) {
                showNotification(`Error: ${error.message}`, false);
            }
        });
    }

    usersTableBody.addEventListener('click', async (e) => {
        const button = e.target.closest('button');
        if (!button) return;

        const userId = button.dataset.userId;

        if (button.classList.contains('btn-save-role')) {
            const select = button.previousElementSibling;
            const newRole = select.value;
            try {
                const response = await fetch(`/api/users/${userId}/role`, {
                    method: 'PUT',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ role: newRole })
                });
                if (!response.ok) throw new Error((await response.json()).error);
                showNotification('Rol de usuario actualizado.');
                fetchUsers();
            } catch (error) {
                showNotification(`Error: ${error.message}`, false);
            }
        } else if (button.classList.contains('btn-delete-user')) {
            if (confirm(`¿Estás seguro de que deseas eliminar al usuario con ID ${userId}?`)) {
                try {
                    const response = await fetch(`/api/users/${userId}`, {
                        method: 'DELETE',
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (!response.ok) throw new Error((await response.json()).error);
                    showNotification('Usuario eliminado correctamente.');
                    fetchUsers(); // Recargar la lista
                } catch (error) {
                    showNotification(`Error: ${error.message}`, false);
                }
            }
        }
    });

    function attachActionButtonListeners() {
        const actionButtons = document.querySelectorAll('.table-actions .btn');
        actionButtons.forEach(button => {
            button.removeEventListener('click', handleActionButtonClick);
            button.addEventListener('click', handleActionButtonClick);
        });
    }

    async function handleActionButtonClick(e) {
        e.preventDefault();
        const button = e.currentTarget;
        const action = button.classList[1];
        const itemId = button.dataset.id;

        if (action === 'btn-delete') {
            if (button.closest('#services-table')) {
                if (confirm('¿Eliminar este servicio?')) {
                    try {
                        const response = await fetch(`/api/services/${itemId}`, {
                            method: 'DELETE',
                            headers: { 'Authorization': `Bearer ${token}` }
                        });
                        if (!response.ok) throw new Error((await response.json()).error || 'Error al eliminar');
                        showNotification('Servicio eliminado correctamente.');
                        fetchServices();
                        fetchDashboardCounts();
                    } catch (error) {
                        showNotification(`Error: ${error.message}`, false);
                    }
                }
                return;
            }
            // ... lógica de borrado para otros tipos
        } else if (action === 'btn-edit') {
            if (button.closest('#finances-table')) {
                const financeToEdit = financesData.find(f => f.id == itemId);
                if (financeToEdit) {
                    openFinanceModal(financeToEdit);
                } else {
                    showNotification('No se encontraron datos para esta financiación.', false);
                }
                return;
            }

            if (button.closest('#services-table')) {
                const serviceToEdit = servicesData.find(s => s.id == itemId);
                if (serviceToEdit) {
                    openServiceModal(serviceToEdit);
                } else {
                    showNotification('No se encontraron datos para este servicio.', false);
                }
                return;
            }
            // ... (lógica de edición genérica para otros tipos)
        } else if (action === 'btn-view') {
            // ... (lógica de vista sin cambios)
        }
    }

    // --- INICIALIZACIÓN ---
    async function initialize() {
        const isAuthenticated = await verifyAuth();
        
        if (!isAuthenticated || !isAdmin()) {
            window.location.href = 'login.html?error=' + encodeURIComponent('Acceso no autorizado');
            return;
        }

        if (userRole === 'superadmin') {
            navUsersLi.style.display = 'list-item';
        }
        
        const initialSection = window.location.hash ? window.location.hash.substring(1) : 'dashboard';
        showSection(initialSection);
        fetchDashboardCounts();
    }

    initialize();
});