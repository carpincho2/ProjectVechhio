export async function checkLogin() {
    try {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
            console.log('No token found');
            return false; 
        }

        console.log('Token:', token); // Debug log

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
            console.log('Auth check response:', data); // Debug log
            
            if (data.loggedIn && data.user) {
                // Actualizar la información del usuario y el token en localStorage
                localStorage.setItem('userName', data.user.username);
                localStorage.setItem('userRole', data.user.role);
                if (data.token) {
                    localStorage.setItem('jwtToken', data.token);
                }

                // Verificar que el rol sea válido para la página actual
                const currentPage = window.location.pathname;
                if (currentPage.includes('panel-control.html')) {
                    if (data.user.role !== 'admin' && data.user.role !== 'superadmin') {
                        localStorage.clear();
                        return false;
                    }
                }
                
                return true;
        }
        // Si la respuesta no es ok o el usuario no está logueado, limpiar localStorage
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('userName');
        localStorage.removeItem('userRole');
        return false;
    } catch (error) {
        console.warn('Error checking login status:', error);
        // En caso de error de red, verificamos la expiración del token
        const token = localStorage.getItem('jwtToken');
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                if (payload.exp * 1000 > Date.now()) {
                    return true; // Token aún válido
                }
            } catch (e) {
                // Si hay error al decodificar el token, lo consideramos inválido
            }
        }
        // Limpiar localStorage si el token es inválido
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('userName');
        localStorage.removeItem('userRole');
        return false;
    }
}
