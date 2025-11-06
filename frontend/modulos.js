export async function checkLogin() {
    try {
        const token = localStorage.getItem('jwtToken');
        if (!token) return false;

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

        localStorage.clear();
        return false;

    } catch (error) {
        const token = localStorage.getItem('jwtToken');
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                if (payload.exp * 1000 > Date.now()) return true;
            } catch {}
        }
        localStorage.clear();
        return false;
    }
}

export async function checkAdminAccess() {
    const loggedIn = await checkLogin();
    const role = localStorage.getItem('userRole');
    if (!loggedIn || (role !== 'admin' && role !== 'superadmin')) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}
