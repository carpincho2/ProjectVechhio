export async function checkLogin() {
    try {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
            console.log('No token found');
            return false; 
        }

        console.log('Token:', token);

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
            console.log('Auth check response:', data);

            if (data.loggedIn && data.user) {
                localStorage.setItem('userName', data.user.username);
                localStorage.setItem('userRole', data.user.role);
                if (data.token) localStorage.setItem('jwtToken', data.token);

                const currentPage = window.location.pathname;
                if (currentPage.includes('panel-control.html')) {
                    if (data.user.role !== 'admin' && data.user.role !== 'superadmin') {
                        localStorage.clear();
                        return false;
                    }
                }

                return true;
            }
        }

        localStorage.removeItem('jwtToken');
        localStorage.removeItem('userName');
        localStorage.removeItem('userRole');
        return false;

    } catch (error) {
        console.warn('Error checking login status:', error);
        const token = localStorage.getItem('jwtToken');
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                if (payload.exp * 1000 > Date.now()) {
                    return true;
                }
            } catch (e) {}
        }
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('userName');
        localStorage.removeItem('userRole');
        return false;
    }
}
