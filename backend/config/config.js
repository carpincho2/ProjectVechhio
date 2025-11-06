// Configuración global de la aplicación
const config = {
    api: {
        baseUrl: 'https://projectvechhio.onrender.com/api',
        timeout: 5000
    },
    auth: {
        tokenKey: 'jwtToken',
        userNameKey: 'userName',
        userRoleKey: 'userRole',
        sessionTimeout: 24 * 60 * 60 * 1000 // 24 horas
    },
    upload: {
        maxFileSize: 5 * 1024 * 1024, // 5MB
        allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
        uploadPath: process.env.NODE_ENV === 'production' ? '/tmp' : 'uploads'
    },
    pagination: {
        itemsPerPage: 10,
        maxPages: 5
    },
    validations: {
        password: {
            minLength: 8,
            pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
        },
        email: {
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        }
    }
};

module.exports = config;