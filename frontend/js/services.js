import { fetchWithAuth, CONFIG } from './utils.js';

// Servicio de Autenticación
export const AuthService = {
    async login(credentials) {
        return await fetchWithAuth('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials)
        });
    },

    async register(userData) {
        return await fetchWithAuth('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    },

    async checkAuth() {
        return await fetchWithAuth('/auth/check');
    },

    async forgotPassword(email) {
        return await fetchWithAuth('/auth/forgot-password', {
            method: 'POST',
            body: JSON.stringify({ email })
        });
    },

    async resetPassword(token, password) {
        return await fetchWithAuth('/auth/reset-password', {
            method: 'POST',
            body: JSON.stringify({ token, password })
        });
    }
};

// Servicio de Vehículos
export const VehicleService = {
    async getAllVehicles(filters = {}) {
        const queryString = new URLSearchParams(filters).toString();
        return await fetchWithAuth(`/vehicles?${queryString}`);
    },

    async getVehicleById(id) {
        return await fetchWithAuth(`/vehicles/${id}`);
    },

    async createVehicle(vehicleData) {
        return await fetchWithAuth('/vehicles', {
            method: 'POST',
            body: vehicleData // FormData para manejar archivos
        });
    },

    async updateVehicle(id, vehicleData) {
        return await fetchWithAuth(`/vehicles/${id}`, {
            method: 'PUT',
            body: vehicleData
        });
    },

    async deleteVehicle(id) {
        return await fetchWithAuth(`/vehicles/${id}`, {
            method: 'DELETE'
        });
    }
};

// Servicio de Finanzas
export const FinanceService = {
    async requestFinancing(financeData) {
        return await fetchWithAuth('/finances', {
            method: 'POST',
            body: JSON.stringify(financeData)
        });
    },

    async getFinanceHistory() {
        return await fetchWithAuth('/finances/history');
    },

    async updateFinanceStatus(id, status) {
        return await fetchWithAuth(`/finances/${id}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status })
        });
    }
};

// Servicio de Servicios
export const ServiceService = {
    async requestService(serviceData) {
        return await fetchWithAuth('/services', {
            method: 'POST',
            body: JSON.stringify(serviceData)
        });
    },

    async getServiceHistory() {
        return await fetchWithAuth('/services/history');
    },

    async updateServiceStatus(id, status) {
        return await fetchWithAuth(`/services/${id}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status })
        });
    }
};

// Servicio de Perfil de Usuario
export const ProfileService = {
    async getProfile() {
        return await fetchWithAuth('/profile');
    },

    async updateEmail(email) {
        return await fetchWithAuth('/profile/email', {
            method: 'PUT',
            body: JSON.stringify({ email })
        });
    },

    async getFinanceHistory() {
        return await fetchWithAuth('/profile/finances');
    },

    async getServiceHistory() {
        return await fetchWithAuth('/profile/services');
    }
};

// Servicio de Estadísticas (Admin)
export const StatisticsService = {
    async getStatistics() {
        return await fetchWithAuth('/statistics');
    }
};