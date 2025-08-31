export async function checkLogin() {
    try {
        const token = localStorage.getItem('jwtToken');
        console.log('DEBUG modulos.js: Token al inicio de checkLogin:', token);
        if (!token) {
            return; 
        }

        const response = await fetch('/api/auth/check', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            console.log('DEBUG modulos.js: Respuesta de /api/auth/check:', JSON.stringify(data, null, 2));
            if (!data.loggedIn || !data.user) {
                console.log('DEBUG modulos.js: Limpiando localStorage por !loggedIn o !user');
                localStorage.removeItem('jwtToken');
                localStorage.removeItem('userRole');
                localStorage.removeItem('userName');
            }
        } else {
            console.log('DEBUG modulos.js: Respuesta NO OK de /api/auth/check:', response.status, response.statusText);
            localStorage.removeItem('jwtToken');
            localStorage.removeItem('userRole');
            localStorage.removeItem('userName');
            console.error('Error al verificar sesión:', response.status, response.statusText);
        }
    } catch (error) {
        console.log('DEBUG modulos.js: Error en fetch de /api/auth/check:', error);
        console.error('Error en la solicitud de verificación de sesión:', error);
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userName');
    }
}
