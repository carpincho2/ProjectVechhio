const db = require('../models');

// Crear un nuevo servicio
exports.createService = async (serviceData) => {
    try {
        const newService = await db.Service.create(serviceData);
        return newService;
    } catch (error) {
        console.error('Error al crear servicio:', error);
        throw new Error('Error interno del servidor');
    }
};

// Obtener todos los servicios
exports.getAllServices = async () => {
    try {
        const services = await db.Service.findAll();
        return services;
    } catch (error) {
        console.error('Error al obtener servicios:', error);
        throw new Error('Error interno del servidor');
    }
};

// Actualizar un servicio
exports.updateService = async (id, serviceData) => {
    try {
        const service = await db.Service.findByPk(id);
        if (!service) {
            throw new Error('Servicio no encontrado');
        }
        await service.update(serviceData);
        return service;
    } catch (error) {
        console.error('Error al actualizar servicio:', error);
        throw new Error('Error interno del servidor');
    }
};
