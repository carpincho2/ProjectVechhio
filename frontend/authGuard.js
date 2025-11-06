export async function checkAdminAccess() {
    const token = localStorage.getItem('jwtToken');
    const role = localStorage.getItem('userRole');

    if (!token || !role) {
        window.location.href = 'login.html?error=' + encodeURIComponent('Sesión expirada');
        return false;
    }

    try {
        const response = await fetch('https://projectvechhio.onrender.com/api/auth/check', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        if (!response.ok || !data.loggedIn) {
            localStorage.clear();
            window.location.href = 'login.html?error=' + encodeURIComponent('Sesión inválida');
            return false;
        }

        // Actualizar token si hay uno nuevo
        if (data.token) {
            localStorage.setItem('jwtToken', data.token);
        }

        // Verificar el rol
        if (data.user.role !== 'admin' && data.user.role !== 'superadmin') {
            localStorage.clear();
            window.location.href = 'login.html?error=' + encodeURIComponent('Acceso no autorizado');
            return false;
        }

        // Si todo está bien, actualizar la información del usuario
        localStorage.setItem('userName', data.user.username);
        localStorage.setItem('userRole', data.user.role);
        return true;
    } catch (error) {
        console.error('Error verificando acceso:', error);
        // En caso de error de red, verificar el token local
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            if (payload.exp * 1000 <= Date.now() || (role !== 'admin' && role !== 'superadmin')) {
                localStorage.clear();
                window.location.href = 'login.html?error=' + encodeURIComponent('Sesión expirada');
                return false;
            }
            return true;
        } catch (e) {
            localStorage.clear();
            window.location.href = 'login.html?error=' + encodeURIComponent('Token inválido');
            return false;
        }
    }
}