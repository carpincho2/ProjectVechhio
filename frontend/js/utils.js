// Configuración de la API
const API_URL = 'https://projectvechhio.onrender.com/api';

// Funciones de utilidad para peticiones HTTP
export async function fetchWithAuth(endpoint, options = {}) {
    const token = localStorage.getItem('jwtToken');
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
    };

    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            ...defaultOptions,
            ...options,
            headers: {
                ...defaultOptions.headers,
                ...options.headers
            }
        });

        if (!response.ok) {
            // Si es error de autenticación, limpiar localStorage y redirigir
            if (response.status === 401 || response.status === 403) {
                localStorage.removeItem('jwtToken');
                localStorage.removeItem('userName');
                localStorage.removeItem('userRole');
                window.location.href = '/login.html?redirect=' + encodeURIComponent(window.location.pathname);
                return null;
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('API request failed:', error);
        throw error;
    }
}

// Función para formatear fechas
export function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('es-AR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Función para formatear moneda
export function formatCurrency(amount) {
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS'
    }).format(amount);
}

// Función para validar formularios
export function validateForm(formData, rules) {
    const errors = {};
    for (const [field, value] of formData.entries()) {
        if (rules[field]) {
            if (rules[field].required && !value) {
                errors[field] = 'Este campo es requerido';
            }
            if (rules[field].minLength && value.length < rules[field].minLength) {
                errors[field] = `Mínimo ${rules[field].minLength} caracteres`;
            }
            if (rules[field].pattern && !rules[field].pattern.test(value)) {
                errors[field] = rules[field].message || 'Formato inválido';
            }
        }
    }
    return errors;
}

// Función para mostrar mensajes de error/éxito
export function showMessage(containerId, message, type = 'error') {
    const container = document.getElementById(containerId);
    if (container) {
        container.textContent = message;
        container.className = `message ${type}`;
        setTimeout(() => {
            container.textContent = '';
            container.className = '';
        }, 5000);
    }
}

// Constantes para validación
export const VALIDATION_PATTERNS = {
    email: {
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: 'Email inválido'
    },
    password: {
        pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
        message: 'La contraseña debe tener al menos 8 caracteres, una letra y un número'
    },
    phone: {
        pattern: /^\+?[0-9]{10,}$/,
        message: 'Número de teléfono inválido'
    }
};

// Constantes para roles de usuario
export const USER_ROLES = {
    ADMIN: 'admin',
    SUPERADMIN: 'superadmin',
    USER: 'user'
};

// Función para verificar permisos
export function checkPermissions(requiredRole) {
    const userRole = localStorage.getItem('userRole');
    if (requiredRole === USER_ROLES.ADMIN) {
        return userRole === USER_ROLES.ADMIN || userRole === USER_ROLES.SUPERADMIN;
    }
    if (requiredRole === USER_ROLES.SUPERADMIN) {
        return userRole === USER_ROLES.SUPERADMIN;
    }
    return true; // Para rol USER
}

// Exportar configuración
export const CONFIG = {
    API_URL,
    PAGINATION: {
        ITEMS_PER_PAGE: 10
    },
    FILE: {
        MAX_SIZE: 5 * 1024 * 1024, // 5MB
        ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp']
    }
};