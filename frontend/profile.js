document.addEventListener('DOMContentLoaded', () => {
    const userProfileDiv = document.getElementById('user-profile');
    const financeHistoryBody = document.getElementById('finance-history-body');
    const serviceHistoryBody = document.getElementById('service-history-body');
    const token = localStorage.getItem('jwtToken');
    if (!token) {
        window.location.href = 'login.html';
        return;
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
            userProfileDiv.innerHTML = `
                <p><strong>Nombre de Usuario:</strong> ${user.username}</p>
                <p><strong>Email:</strong> ${user.email}</p>
                <p><strong>Rol:</strong> ${user.role}</p>
            `;
        } catch (error) {
            userProfileDiv.innerHTML = `<p style="color: red;">${error.message}</p>`;
        }
    };

    // Función para cargar el historial de financiación
    const fetchFinanceHistory = async () => {
        try {
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

            if (history.length === 0) {
                financeHistoryBody.innerHTML = '<tr><td colspan="5">No tienes solicitudes de financiación.</td></tr>';
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
                    <td><span class="status-${item.status}">${item.status}</span></td>
                `;
                financeHistoryBody.appendChild(row);
            });

        } catch (error) {
            financeHistoryBody.innerHTML = `<tr><td colspan="5" style="color: red;">${error.message}</td></tr>`;
        }
    };

    // Función para cargar el historial de turnos de taller
    const fetchServiceHistory = async () => {
        try {
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

            if (history.length === 0) {
                serviceHistoryBody.innerHTML = '<tr><td colspan="4">No tienes turnos de taller registrados.</td></tr>';
                return;
            }

            history.forEach(item => {
                const row = document.createElement('tr');
                const vehicleName = item.Vehicle ? `${item.Vehicle.brand} ${item.Vehicle.model} (${item.Vehicle.year})` : 'N/A';
                
                row.innerHTML = `
                    <td>${vehicleName}</td>
                    <td>${item.type}</td>
                    <td>${new Date(item.date).toLocaleDateString()}</td>
                    <td><span class="status-${item.status}">${item.status}</span></td>
                `;
                serviceHistoryBody.appendChild(row);
            });

        } catch (error) {
            serviceHistoryBody.innerHTML = `<tr><td colspan="4" style="color: red;">${error.message}</td></tr>`;
        }
    };

    // Cargar todos los datos al iniciar la página
    fetchUserProfile();
    fetchFinanceHistory();
    fetchServiceHistory();
});
