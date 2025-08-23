document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error');
    const success = urlParams.get('success');
    
    const errorMessage = document.getElementById('errorMessage');
    const successMessage = document.getElementById('successMessage');
    
    if (error) {
        errorMessage.textContent = decodeURIComponent(error);
        errorMessage.style.display = 'block';
    }
    
    if (success) {
        successMessage.textContent = decodeURIComponent(success);
        successMessage.style.display = 'block';
    }
    
    const loginForm = document.getElementById('loginForm');
    loginForm.addEventListener('submit', function(e) {
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        
        if (!username || !password) {
            e.preventDefault();
            errorMessage.textContent = 'Por favor, completa todos los campos.';
            errorMessage.style.display = 'block';
        }
    });
});
