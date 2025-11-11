// auth.js - Manejo centralizado de autenticación
export function getToken() {
    return localStorage.getItem('jwtToken');
}

export function setToken(token) {
    if (token) {
        localStorage.setItem('jwtToken', token);
    }
}

export function clearAuth() {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
}

export function setUserInfo(user) {
    if (user) {
        localStorage.setItem('userName', user.username);
        localStorage.setItem('userRole', user.role);
    }
}

export async function verifyAuth() {
    const token = getToken();
    
    if (!token) {
        return false;
    }

    try {
        const response = await fetch('https://projectvechhio.onrender.com/api/auth/check', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });

        const data = await response.json();
        
        if (response.ok && data.loggedIn && data.user) {
            setUserInfo(data.user);
            if (data.token) {
                setToken(data.token);
            }
            return true;
        }

        clearAuth();
        return false;
    } catch (error) {
        clearAuth();
        return false;
    }
}

export function isAdmin() {
    const role = localStorage.getItem('userRole');
    return role === 'admin' || role === 'superadmin';
}