document.addEventListener('DOMContentLoaded', () => {
    // Elementos de navegación
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    const logoutLinks = document.querySelectorAll('a[href="/logout"]');
    const addVehicleForm = document.getElementById('add-vehicle-form');
    const addServiceForm = document.getElementById('add-service-form');
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notification-text');
    const vehiclesTableBody = document.querySelector('#vehicles-table tbody');
    const servicesTableBody = document.querySelector('#services-table tbody');
    const financesTableBody = document.querySelector('#finances-table tbody');
    
    // Función para mostrar notificaciones
    function showNotification(message, isSuccess = true) {
        notificationText.textContent = message;
        notification.style.backgroundColor = isSuccess ? 'var(--success)' : 'var(--danger)';
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }


    // Función para obtener el token JWT
    function getAuthHeaders() {
        const token = localStorage.getItem('jwtToken');
        if (token) {
            return { 'Authorization': `Bearer ${token}` };
        } else {
            // Si no hay token, redirigir al login
            window.location.href = '/login.html?error=Sesión expirada o no iniciada';
            return {};
        }
    }

    // Función para manejar errores de autenticación
    function handleAuthError(response) {
        if (response.status === 401 || response.status === 403) {
            localStorage.removeItem('jwtToken');
            localStorage.removeItem('userRole');
            localStorage.removeItem('userName');
            showNotification('Sesión expirada o no autorizada. Por favor, inicia sesión de nuevo.', false);
            setTimeout(() => {
                window.location.href = '/login.html';
            }, 1500);
            return true; // Indica que se manejó un error de auth
        }
        return false; // No es un error de auth
    }
    
    // Función para cambiar de sección
    function showSection(sectionId) {
        sections.forEach(section => {
            section.classList.remove('active');
        });
        
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
        }
        
        navLinks.forEach(link => {
            if (link.getAttribute('href') === `#${sectionId}`) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
        
        window.history.replaceState(null, null, `#${sectionId}`);
        window.scrollTo(0, 0);

        // Fetch data for the active section
        if (sectionId === 'vehicles') {
            fetchVehicles();
        } else if (sectionId === 'services') {
            fetchServices();
        } else if (sectionId === 'finances') {
            fetchFinances();
        } else if (sectionId === 'profile') {
            // La sección de perfil se maneja en profile.html, no aquí
            // Si se quiere cargar dinámicamente aquí, se necesitaría una función fetchProfile
            // similar a las otras, pero el plan indica que profile.html es una página separada.
            // Por ahora, no hacemos nada aquí para 'profile'
        }
    }
    
    // Fetch and display vehicles
    async function fetchVehicles() {
        try {
            const response = await fetch('/api/vehicles', {
                headers: getAuthHeaders()
            });
            if (handleAuthError(response)) return; // Manejar error de autenticación
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

    // Fetch and display services
    async function fetchServices() {
        try {
            const response = await fetch('/api/services', {
                headers: getAuthHeaders()
            });
            if (handleAuthError(response)) return; // Manejar error de autenticación
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const services = await response.json();
            
            servicesTableBody.innerHTML = ''; // Clear existing rows
            
            services.forEach(service => {
                const row = servicesTableBody.insertRow();
                row.innerHTML = `
                    <td>${service.type}</td>
                    <td>${service.date}</td>
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

    // Fetch and display finances
    async function fetchFinances() {
        try {
            const response = await fetch('/api/finances', {
                headers: getAuthHeaders()
            });
            if (handleAuthError(response)) return; // Manejar error de autenticación
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
                            headers: getAuthHeaders()
                        });

                        if (handleAuthError(response)) return; // Manejar error de autenticación
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
                    const currentResponse = await fetch(apiEndpoint, {
                        headers: getAuthHeaders()
                    });
                    if (handleAuthError(currentResponse)) return; // Manejar error de autenticación
                    if (!currentResponse.ok) {
                        throw new Error(`HTTP error! status: ${currentResponse.status}`);
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
                                ...getAuthHeaders() // Añadir headers de autenticación
                            },
                            body: JSON.stringify(updatedData),
                        });

                        if (handleAuthError(response)) return; // Manejar error de autenticación
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
            }

            if (apiEndpoint) {
                try {
                    const response = await fetch(apiEndpoint, {
                        headers: getAuthHeaders()
                    });
                    if (handleAuthError(response)) return; // Manejar error de autenticación
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    const item = await response.json();
                    let details = `Detalles del Elemento:

`;
                    for (const key in item) {
                        details += `${key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}: ${item[key]}
`;
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

    // Manejar clics en enlaces de navegación
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            showSection(targetId);
        });
    });
    
    // Manejar cierre de sesión
    logoutLinks.forEach(link => {
        link.addEventListener('click', async (e) => { // Añadir async
            e.preventDefault();
            // Llamar al endpoint de logout del backend (opcional, si hay limpieza de cookies/sesiones)
            try {
                const response = await fetch('/api/auth/logout', { method: 'POST' }); // Cambiado a POST
                if (!response.ok) {
                    console.error('Error al llamar al logout del backend', response.status);
                }
            } catch (error) {
                console.error('Error de red al llamar al logout del backend', error);
            }
            localStorage.removeItem('jwtToken');
            localStorage.removeItem('userRole');
            localStorage.removeItem('userName');
            showNotification('Sesión cerrada correctamente');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        });
    });
    
    // Manejar envío de formulario de vehículos
    if (addVehicleForm) {
        addVehicleForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(addVehicleForm);
            
            try {
                const response = await fetch('/api/vehicles', {
                    method: 'POST',
                    body: formData,
                    headers: getAuthHeaders() // Añadir headers de autenticación
                });

                if (handleAuthError(response)) return; // Manejar error de autenticación
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
                }
                showNotification('Vehículo añadido correctamente');
                addVehicleForm.reset();
                fetchVehicles(); // Refresh the list
            } catch (error) {
                console.error('Error al añadir vehículo:', error);
                showNotification(`Error: ${error.message}`, false);
            }
        });
    }
    
    // Manejar envío de formulario de servicios
    if (addServiceForm) {
        addServiceForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(addServiceForm);
            
            try {
                const response = await fetch('/api/services', {
                    method: 'POST',
                    body: formData,
                    headers: getAuthHeaders() // Añadir headers de autenticación
                });

                if (handleAuthError(response)) return; // Manejar error de autenticación
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
                }
                showNotification('Servicio añadido correctamente');
                addServiceForm.reset();
                fetchServices(); // Refresh the list
            } catch (error) {
                console.error('Error al añadir servicio:', error);
                showNotification(`Error: ${error.message}`, false);
            }
        });
    }
    
    // Cargar sección basada en el hash de la URL al cargar la página
    if (window.location.hash) {
        const targetId = window.location.hash.substring(1);
        showSection(targetId);
    } else {
        // Mostrar la sección de dashboard por defecto si no hay hash
        showSection('dashboard');
    }
    
    // Initial fetch of vehicles when the page loads
    fetchVehicles();
});