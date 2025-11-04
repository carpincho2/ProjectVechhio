export async function checkLogin() {
    try {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
            return false; 
        }

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
            return data.loggedIn && data.user;
        }
        return false;
    } catch (error) {
        console.warn('Error checking login status:', error);
        // En caso de error de red, asumimos que el token sigue siendo válido
        return true;
    }
}
