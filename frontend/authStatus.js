function updateAuthStatus() {
    const token = localStorage.getItem('jwtToken');
    const userName = localStorage.getItem('userName');
    const userPanelLink = document.getElementById('userPanelLink');
    const loginRegisterLink = document.getElementById('loginRegisterLink');
    const logoutLink = document.getElementById('logoutLink');

    if (token && userName) {
        userPanelLink.style.display = 'block';
        loginRegisterLink.style.display = 'none';
        logoutLink.style.display = 'block';
    } else {
        userPanelLink.style.display = 'none';
        loginRegisterLink.style.display = 'block';
        logoutLink.style.display = 'none';
    }
}


function logout() {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    window.location.href = 'index.html';
}
