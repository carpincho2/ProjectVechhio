import { checkAdminAccess } from './modulos.js';

document.addEventListener('DOMContentLoaded', async () => {
    const navLinks = document.querySelectorAll('.nav-link');
    const navUsersLi = document.getElementById('nav-users');
    const userRole = localStorage.getItem('userRole');
    const userName = localStorage.getItem('userName');
    const userDisplay = document.getElementById('userDisplay');

    if (userDisplay && userName) {
        userDisplay.textContent = userName;
    }

    function showSection(sectionId) {
        const sections = document.querySelectorAll('.section');
        sections.forEach(section => section.classList.add('hidden'));

        const sectionToShow = document.getElementById(sectionId);
        if (sectionToShow) {
            sectionToShow.classList.remove('hidden');
        }
    }

    function isAdmin() {
        return userRole === 'admin' || userRole === 'superadmin';
    }

    async function verifyAuth() {
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
                return data.loggedIn && data.user;
            }

            localStorage.clear();
            return false;
        } catch {
            localStorage.clear();
            return false;
        }
    }

    async function fetchDashboardCounts() {
        try {
            const token = localStorage.getItem('jwtToken');
            const response = await fetch('https://projectvechhio.onrender.com/api/dashboard/counts', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                const usersCount = document.getElementById('usersCount');
                const vehiclesCount = document.getElementById('vehiclesCount');
                if (usersCount) usersCount.textContent = data.users || 0;
                if (vehiclesCount) vehiclesCount.textContent = data.vehicles || 0;
            }
        } catch (error) {
            console.error('Error cargando los datos del dashboard:', error);
        }
    }

    async function initialize() {
        const isAuthenticated = await verifyAuth();

        if (!isAuthenticated || !isAdmin()) {
            window.location.href = 'index.html';
            return;
        }

        const hash = window.location.hash.substring(1);
        showSection(hash || 'dashboard');

        if (userRole === 'superadmin') {
            navUsersLi.style.display = 'block';
        } else {
            navUsersLi.style.display = 'none';
        }

        fetchDashboardCounts();
    }

    async function checkAdminAccessWrapper() {
        const isAuthenticated = await checkAdminAccess();
        if (!isAuthenticated) {
            window.location.href = 'index.html';
        }
    }

    navLinks.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const target = e.target.getAttribute('href').substring(1);
            showSection(target);
            window.location.hash = target;
        });
    });

    initialize();
    checkAdminAccessWrapper();
});
