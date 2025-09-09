document.addEventListener('DOMContentLoaded', () => {
    const userProfileDiv = document.getElementById('user-profile');
    const financeHistoryBody = document.getElementById('finance-history-body');
    const serviceHistoryBody = document.getElementById('service-history-body');
    const financeCount = document.getElementById('finance-count');
    const serviceCount = document.getElementById('service-count');
    const editProfileBtn = document.getElementById('edit-profile-btn');
    const refreshFinancesBtn = document.getElementById('refresh-finances');
    const refreshServicesBtn = document.getElementById('refresh-services');
    const adminLinkContainer = document.getElementById('admin-link-container');

    const token = localStorage.getItem('jwtToken');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    // Refresh buttons
    if (refreshFinancesBtn) {
        refreshFinancesBtn.addEventListener('click', fetchFinanceHistory);
    }
    if (refreshServicesBtn) {
        refreshServicesBtn.addEventListener('click', fetchServiceHistory);
    }
    
    // Edit profile button
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', () => {
            alert('Funcionalidad de edición de perfil en desarrollo.');
        });
    }

    // Función para cargar los datos del perfil del usuario
    const fetchUserProfile = async () => {
        try {
            const response = await fetch('/api/profile', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('No se pudo cargar el perfil.');
            }

            const user = await response.json();
            
            // Rellenar la información del perfil
            userProfileDiv.innerHTML = `
                <p><strong><i class="fas fa-user"></i> Nombre de Usuario:</strong> <span>${user.username}</span></p>
                <p><strong><i class="fas fa-envelope"></i> Email:</strong> <span>${user.email}</span></p>
                <p><strong><i class="fas fa-user-tag"></i> Rol:</strong> <span>${user.role}</span></p>
            `;

            // Mostrar u ocultar el botón de administrador según el rol
            if (adminLinkContainer) {
                if (user.role === 'admin' || user.role === 'superadmin') {
                    adminLinkContainer.style.display = 'block';
                } else {
                    adminLinkContainer.style.display = 'none';
                }
            }
        } catch (error) {
            userProfileDiv.innerHTML = `<p class="error-message">${error.message}</p>`;
        }
    };

    // Función para cargar el historial de financiación
    const fetchFinanceHistory = async () => {
        try {
            if (refreshFinancesBtn) refreshFinancesBtn.classList.add('rotating');
            const response = await fetch('/api/profile/finances', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('No se pudo cargar el historial de financiación.');
            }

            const history = await response.json();
            financeHistoryBody.innerHTML = ''; // Limpiar el cuerpo de la tabla
            
            if (financeCount) financeCount.textContent = history.length;

            if (history.length === 0) {
                financeHistoryBody.innerHTML = '<tr><td colspan="5" class="no-data">No tienes solicitudes de financiación.</td></tr>';
                return;
            }

            history.forEach(item => {
                const row = document.createElement('tr');
                const vehicleName = item.Vehicle ? `${item.Vehicle.brand} ${item.Vehicle.model} (${item.Vehicle.year})` : 'Vehículo no disponible';
                
                row.innerHTML = `
                    <td>${vehicleName}</td>
                    <td>${new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(item.amount)}</td>
                    <td>${item.term}</td>
                    <td>${new Date(item.createdAt).toLocaleDateString()}</td>
                    <td><span class="status-${item.status.toLowerCase()}">${item.status}</span></td>
                `;
                financeHistoryBody.appendChild(row);
            });

        } catch (error) {
            financeHistoryBody.innerHTML = `<tr><td colspan="5" class="error-message">${error.message}</td></tr>`;
        } finally {
            if (refreshFinancesBtn) refreshFinancesBtn.classList.remove('rotating');
        }
    };

    // Función para cargar el historial de turnos de taller
    const fetchServiceHistory = async () => {
        try {
            if (refreshServicesBtn) refreshServicesBtn.classList.add('rotating');
            const response = await fetch('/api/profile/services', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('No se pudo cargar el historial de turnos.');
            }

            const history = await response.json();
            serviceHistoryBody.innerHTML = ''; // Limpiar el cuerpo de la tabla
            
            if (serviceCount) serviceCount.textContent = history.length;

            if (history.length === 0) {
                serviceHistoryBody.innerHTML = '<tr><td colspan="4" class="no-data">No tienes turnos de taller registrados.</td></tr>';
                return;
            }

            history.forEach(item => {
                const row = document.createElement('tr');
                const vehicleName = item.Vehicle ? `${item.Vehicle.brand} ${item.Vehicle.model} (${item.Vehicle.year})` : 'N/A';
                
                row.innerHTML = `
                    <td>${vehicleName}</td>
                    <td>${item.type}</td>
                    <td>${new Date(item.date).toLocaleDateString()}</td>
                    <td><span class="status-${item.status.toLowerCase()}">${item.status}</span></td>
                `;
                serviceHistoryBody.appendChild(row);
            });

        } catch (error) {
            serviceHistoryBody.innerHTML = `<tr><td colspan="4" class="error-message">${error.message}</td></tr>`;
        } finally {
            if (refreshServicesBtn) refreshServicesBtn.classList.remove('rotating');
        }
    };

    // Cargar todos los datos al iniciar la página
    fetchUserProfile();
    fetchFinanceHistory();
    fetchServiceHistory();
});

// Add rotation animation for refresh buttons
const style = document.createElement('style');
style.textContent = `
    @keyframes rotate {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    
    .rotating {
        animation: rotate 1s linear infinite;
    }
    
    .no-data {
        text-align: center;
        color: var(--letra-secondary);
        font-style: italic;
        padding: 2rem;
    }
    
    .user-role {
        text-transform: capitalize;
        background-color: var(--fondo-light);
        padding: 0.2rem 0.5rem;
        border-radius: 4px;
        font-size: 0.9rem;
    }
    
    .error-message {
        color: var(--error);
    }
`;
document.head.appendChild(style);