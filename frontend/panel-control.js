document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENTOS DEL DOM ---
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    const logoutLinks = document.querySelectorAll('a[href="/logout"]');
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notification-text');

    // Forms
    const addVehicleForm = document.getElementById('add-vehicle-form');

    // Table Bodies
    const vehiclesTableBody = document.querySelector('#vehicles-table tbody');
    const servicesTableBody = document.querySelector('#services-table tbody');
    const financesTableBody = document.querySelector('#finances-table tbody');
    const usersTableBody = document.querySelector('#users-table tbody');

    // Nav Links Específicos
    const navUsersLi = document.getElementById('nav-users-li');

    // --- ESTADO DE LA APP ---
    const token = localStorage.getItem('jwtToken');
    const userRole = localStorage.getItem('userRole');

    // --- FUNCIONES ---

    // Función para mostrar notificaciones
    function showNotification(message, isSuccess = true) {
        notificationText.textContent = message;
        notification.style.backgroundColor = isSuccess ? '#28a745' : '#dc3545';
        notification.classList.add('show');
        setTimeout(() => notification.classList.remove('show'), 3000);
    }

    // Función para cambiar de sección
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

        // Cargar datos para la sección activa
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
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const vehicles = await response.json();
            
            vehiclesTableBody.innerHTML = ''; // Clear existing rows
            
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
            // Re-attach event listeners to new buttons
            attachActionButtonListeners();
        } catch (error) {
            console.error('Error fetching vehicles:', error);
            showNotification('Error al cargar vehículos.', false);
        }
    }

    async function fetchServices() {
        try {
            const response = await fetch('/api/services', { headers: { 'Authorization': `Bearer ${token}` } });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const services = await response.json();
            
            servicesTableBody.innerHTML = ''; // Clear existing rows
            
            services.forEach(service => {
                const row = servicesTableBody.insertRow();
                row.innerHTML = `
                    <td>${service.serviceType}</td>
                    <td>${new Date(service.requestDate).toLocaleDateString()}</td>
                    <td>${service.status}</td>
                    <td class="table-actions">
                        <button class="btn btn-view" data-id="${service.id}"><i class="fas fa-eye"></i></button>
                        <button class="btn btn-edit" data-id="${service.id}"><i class="fas fa-edit"></i></button>
                        <button class="btn btn-delete" data-id="${service.id}"><i class="fas fa-trash"></i></button>
                    </td>
                `;
            });
            // Re-attach event listeners to new buttons
            attachActionButtonListeners();
        } catch (error) {
            console.error('Error fetching services:', error);
            showNotification('Error al cargar servicios.', false);
        }
    }

    async function fetchFinances() {
        try {
            const response = await fetch('/api/finances', { headers: { 'Authorization': `Bearer ${token}` } });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const finances = await response.json();
            
            financesTableBody.innerHTML = ''; // Clear existing rows
            
            finances.forEach(finance => {
                const row = financesTableBody.insertRow();
                row.innerHTML = `
                    <td>${finance.id}</td>
                    <td>${finance.amount}</td>
                    <td>${finance.term}</td>
                    <td>${finance.status}</td>
                    <td class="table-actions">
                        <button class="btn btn-view" data-id="${finance.id}"><i class="fas fa-eye"></i></button>
                        <button class="btn btn-edit" data-id="${finance.id}"><i class="fas fa-edit"></i></button>
                        <button class="btn btn-delete" data-id="${finance.id}"><i class="fas fa-trash"></i></button>
                    </td>
                `;
            });
            // Re-attach event listeners to new buttons
            attachActionButtonListeners();
        } catch (error) {
            console.error('Error fetching finances:', error);
            showNotification('Error al cargar finanzas.', false);
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
                row.innerHTML = `
                    <td>${user.id}</td>
                    <td>${user.username}</td>
                    <td>${user.email}</td>
                    <td>${user.role}</td>
                    <td class="table-actions">
                        <select class="role-select" data-user-id="${user.id}">
                            <option value="user" ${user.role === 'user' ? 'selected' : ''}>User</option>
                            <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Admin</option>
                            <option value="superadmin" ${user.role === 'superadmin' ? 'selected' : ''}>Superadmin</option>
                        </select>
                        <button class="btn btn-save-role" data-user-id="${user.id}">Guardar</button>
                    </td>
                `;
            });
        } catch (error) {
            console.error('Error fetching users:', error);
            showNotification(error.message, false);
        }
    }

    async function fetchDashboardCounts() {
        try {
            // Fetch User Count (if applicable, assuming 'userCount' element exists)
            // const usersResponse = await fetch('/api/users/all', { headers: { 'Authorization': `Bearer ${token}` } });
            // if (usersResponse.ok) {
            //     const users = await usersResponse.json();
            //     const userCountElement = document.getElementById('userCount');
            //     if (userCountElement) {
            //         userCountElement.textContent = users.length;
            //     }
            // }

            // Fetch Vehicle Count
            const vehiclesResponse = await fetch('/api/vehicles', { headers: { 'Authorization': `Bearer ${token}` } });
            if (vehiclesResponse.ok) {
                const vehicles = await vehiclesResponse.json();
                document.getElementById('totalVehicles').textContent = vehicles.length;

                let newVehiclesCount = 0;
                let usedVehiclesCount = 0;

                vehicles.forEach(vehicle => {
                    if (vehicle.condition === 'Nuevo') {
                        newVehiclesCount++;
                    } else if (vehicle.condition === 'Usado') {
                        usedVehiclesCount++;
                    }
                });

                document.getElementById('newVehicles').textContent = newVehiclesCount;
                document.getElementById('usedVehicles').textContent = usedVehiclesCount;
            }

            // Fetch Service Counts
            const servicesResponse = await fetch('/api/services', { headers: { 'Authorization': `Bearer ${token}` } });
            if (servicesResponse.ok) {
                const services = await servicesResponse.json();
                let scheduledServicesCount = 0;
                let completedServicesCount = 0;
                let pendingServicesCount = 0;

                services.forEach(service => {
                    if (service.status === 'Programado') { // Assuming 'Programado' for scheduled
                        scheduledServicesCount++;
                    } else if (service.status === 'Completado') { // Assuming 'Completado' for completed
                        completedServicesCount++;
                    } else if (service.status === 'Pendiente') { // Assuming 'Pendiente' for pending
                        pendingServicesCount++;
                    }
                });

                document.getElementById('scheduledServices').textContent = scheduledServicesCount;
                document.getElementById('completedServices').textContent = completedServicesCount;
                document.getElementById('pendingServices').textContent = pendingServicesCount;
            }

            // Fetch Finance Statistics from the new, efficient endpoint
            const financeStatsResponse = await fetch('/api/statistics/finances', { headers: { 'Authorization': `Bearer ${token}` } });
            if (financeStatsResponse.ok) {
                const stats = await financeStatsResponse.json();
                document.getElementById('totalFinanceRequests').textContent = stats.total;
                document.getElementById('approvedFinances').textContent = stats.approved;
                document.getElementById('pendingFinances').textContent = stats.pending;
                document.getElementById('rejectedFinances').textContent = stats.rejected;
            }

        } catch (error) {
            console.error('Error fetching dashboard counts:', error);
            showNotification('Error al cargar estadísticas del panel.', false);
        }
    }

    // --- MANEJO DE EVENTOS ---

    // Navegación
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            showSection(targetId);
        });
    });

    // Logout
    logoutLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.clear();
            showNotification('Sesión cerrada correctamente');
            setTimeout(() => window.location.href = 'index.html', 1000);
        });
    });

    // Enviar formulario de vehículo
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

    // Guardar cambio de rol de usuario
    usersTableBody.addEventListener('click', async (e) => {
        if (e.target.classList.contains('btn-save-role')) {
            const button = e.target;
            const userId = button.dataset.userId;
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
                fetchUsers(); // Recargar la lista
            } catch (error) {
                showNotification(`Error: ${error.message}`, false);
            }
        }
    });

    // Attach event listeners to action buttons (view, edit, delete)
    function attachActionButtonListeners() {
        const actionButtons = document.querySelectorAll('.table-actions .btn');
        actionButtons.forEach(button => {
            button.removeEventListener('click', handleActionButtonClick); // Prevent duplicate listeners
            button.addEventListener('click', handleActionButtonClick);
        });
    }

    async function handleActionButtonClick(e) {
        e.preventDefault();
        const button = e.currentTarget;
        const action = button.classList[1]; // btn-view, btn-edit, btn-delete
        const itemId = button.dataset.id; // Use itemId as it can be vehicle, service, or finance

        if (action === 'btn-delete') {
            if (confirm('¿Estás seguro de que deseas eliminar este elemento?')) {
                let apiEndpoint = '';
                // Determine the API endpoint based on the current section or button context
                // For simplicity, assuming the button is within a table that implies its type
                if (button.closest('#vehicles-table')) {
                    apiEndpoint = `/api/vehicles/${itemId}`;
                } else if (button.closest('#services-table')) {
                    apiEndpoint = `/api/services/${itemId}`;
                } else if (button.closest('#finances-table')) {
                    apiEndpoint = `/api/finances/${itemId}`;
                }

                if (apiEndpoint) {
                    try {
                        const response = await fetch(apiEndpoint, {
                            method: 'DELETE',
                            headers: { 'Authorization': `Bearer ${token}` }
                        });

                        if (!response.ok) {
                            throw new Error(`HTTP error! status: ${response.status}`);
                        }
                        showNotification('Elemento eliminado correctamente');
                        // Refresh the list based on the table
                        if (button.closest('#vehicles-table')) {
                            fetchVehicles();
                        } else if (button.closest('#services-table')) {
                            fetchServices();
                        } else if (button.closest('#finances-table')) {
                            fetchFinances();
                        }
                    } catch (error) {
                        console.error('Error deleting item:', error);
                        showNotification('Error al eliminar elemento.', false);
                    }
                } else {
                    showNotification('No se pudo determinar el tipo de elemento a eliminar.', false);
                }
            }
        } else if (action === 'btn-edit') {
            let apiEndpoint = '';
            let refreshFunction;
            let fieldsToEdit = [];

            if (button.closest('#vehicles-table')) {
                apiEndpoint = `/api/vehicles/${itemId}`;
                refreshFunction = fetchVehicles;
                fieldsToEdit = ['brand', 'model', 'year', 'price', 'condition', 'mileage', 'color', 'description'];
            } else if (button.closest('#services-table')) {
                apiEndpoint = `/api/services/${itemId}`;
                refreshFunction = fetchServices;
                fieldsToEdit = ['type', 'date', 'status', 'userId', 'vehicleId'];
            } else if (button.closest('#finances-table')) {
                apiEndpoint = `/api/finances/${itemId}`;
                refreshFunction = fetchFinances;
                fieldsToEdit = ['amount', 'term', 'userId'];
            }

            if (apiEndpoint) {
                try {
                    // Fetch current data to pre-fill prompt
                    const currentResponse = await fetch(apiEndpoint, { headers: { 'Authorization': `Bearer ${token}` } });
                    if (!currentResponse.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    const currentItem = await currentResponse.json();

                    let updatedData = {};
                    let changesMade = false;

                    for (const field of fieldsToEdit) {
                        let newValue = prompt(`Editar ${field} (actual: ${currentItem[field]}):`, currentItem[field]);
                        if (newValue !== null && newValue !== String(currentItem[field])) { // Check for null (cancel) and actual change
                            updatedData[field] = newValue;
                            changesMade = true;
                        }
                    }

                    if (changesMade) {
                        const response = await fetch(apiEndpoint, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                            },
                            body: JSON.stringify(updatedData),
                        });

                        if (!response.ok) {
                            const errorData = await response.json();
                            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
                        }
                        showNotification('Elemento actualizado correctamente');
                        refreshFunction(); // Refresh the list
                    } else {
                        showNotification('No se realizaron cambios.', false);
                    }
                } catch (error) {
                    console.error('Error al editar elemento:', error);
                    showNotification(`Error al editar elemento: ${error.message}`, false);
                }
            } else {
                showNotification('No se pudo determinar el tipo de elemento a editar.', false);
            }
        } else if (action === 'btn-view') {
            // For view, we need to know the type of item
            let apiEndpoint = '';
            if (button.closest('#vehicles-table')) {
                apiEndpoint = `/api/vehicles/${itemId}`;
            } else if (button.closest('#services-table')) {
                apiEndpoint = `/api/services/${itemId}`;
            } else if (button.closest('#finances-table')) {
                apiEndpoint = `/api/finances/${itemId}`;
            }

            if (apiEndpoint) {
                try {
                    const response = await fetch(apiEndpoint, { headers: { 'Authorization': `Bearer ${token}` } });
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    const item = await response.json();
                    let details = `Detalles del Elemento:\n\n`;
                    for (const key in item) {
                        details += `${key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}: ${item[key]}\n`;
                    }
                    alert(details);
                    showNotification('Vista detallada del elemento ' + itemId);
                } catch (error) {
                    console.error('Error fetching item details:', error);
                    showNotification('Error al cargar detalles del elemento.', false);
                }
            } else {
                showNotification('No se pudo determinar el tipo de elemento a ver.', false);
            }
        }
    }

    // --- INICIALIZACIÓN ---
    function initialize() {
        if (!token) {
            window.location.href = 'login.html';
            return;
        }

        // Mostrar pestaña de usuarios si es superadmin
        if (userRole === 'superadmin') {
            navUsersLi.style.display = 'list-item';
        }

        // Cargar sección inicial
        const initialSection = window.location.hash ? window.location.hash.substring(1) : 'dashboard';
        showSection(initialSection);
        fetchDashboardCounts(); // Call fetchDashboardCounts here
    }

    initialize();
});
