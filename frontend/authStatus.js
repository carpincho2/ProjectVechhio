function updateAuthStatus() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    const userPanelLink = document.getElementById('userPanelLink');
    const loginRegisterLink = document.getElementById('loginRegisterLink');
    const logoutLink = document.getElementById('logoutLink');

    if (token && user) {
        userPanelLink.style.display = 'block';
        loginRegisterLink.style.display = 'none';
        logoutLink.style.display = 'block';
    } else {
        userPanelLink.style.display = 'none';
        loginRegisterLink.style.display = 'block';
        logoutLink.style.display = 'none';
    }
}
