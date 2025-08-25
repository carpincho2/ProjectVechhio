document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('jwtToken');
    const userNamePlaceholder = document.getElementById('user-name-placeholder');
    const logoutBtn = document.getElementById('logout-btn');

    // Elementos de la tarjeta de perfil
    const profileUsername = document.getElementById('profile-username');
    const profileEmail = document.getElementById('profile-email');
    const profileRole = document.getElementById('profile-role');
    const profileError = document.getElementById('profile-error');
    const adminLinkContainer = document.getElementById('admin-link-container');

    if (!token) {
        // Si no hay token, redirigir al login
        window.location.href = '/login.html';
        return;
    }

    try {
        // Realizar la petición al backend para obtener los datos del perfil
        const response = await fetch('/api/profile', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const user = await response.json();

            // Rellenar la tarjeta de perfil
            profileUsername.textContent = user.username;
            profileEmail.textContent = user.email;
            profileRole.textContent = user.role;

            // Rellenar el nombre de usuario en la cabecera
            if (userNamePlaceholder) {
                userNamePlaceholder.textContent = user.username;
            }

            // Mostrar el enlace al panel de control si el usuario es admin o superadmin
            if (user.role === 'admin' || user.role === 'superadmin') {
                adminLinkContainer.style.display = 'block';
            }

        } else {
            // Si el token es inválido o expirado, el servidor devolverá un error
            const errorData = await response.json();
            throw new Error(errorData.error || 'No se pudo obtener el perfil.');
        }

    } catch (error) {
        console.error('Error al obtener el perfil:', error);
        // Limpiar el token inválido y redirigir al login
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userName');
        profileError.textContent = `Error: ${error.message} Serás redirigido al login.`;
        profileError.style.display = 'block';
        
        setTimeout(() => {
            window.location.href = '/login.html';
        }, 3000);
    }

    // Funcionalidad del botón de logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('jwtToken');
            localStorage.removeItem('userRole');
            localStorage.removeItem('userName');
            window.location.href = '/index.html';
        });
    }
});
