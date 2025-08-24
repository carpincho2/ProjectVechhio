const express = require('express');
const router = express.Router();
const db = require('../models'); // Importa la instancia de la base de datos
const { verifyJWT, isAdmin } = require('../middlewares/authmiddleware'); // Importa los middlewares de autenticación

// Ruta para crear un nuevo servicio (solo admin)
router.post('/', verifyJWT, isAdmin, async (req, res) => {
    try {
        const { type, date, status, userId, vehicleId } = req.body; // Ejemplo de campos
        const newService = await db.Service.create({ type, date, status, userId, vehicleId });
        res.status(201).json(newService);
    } catch (error) {
        console.error('Error al crear servicio:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Ruta para obtener todos los servicios (solo admin)
router.get('/', verifyJWT, isAdmin, async (req, res) => {
    try {
        const services = await db.Service.findAll();
        res.status(200).json(services);
    } catch (error) {
        console.error('Error al obtener servicios:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Ruta para actualizar un servicio (solo admin)
router.put('/:id', verifyJWT, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { type, date, status, userId, vehicleId } = req.body;

        const service = await db.Service.findByPk(id);
        if (!service) {
            return res.status(404).json({ error: 'Servicio no encontrado' });
        }

        await service.update({ type, date, status, userId, vehicleId });
        res.status(200).json(service);
    } catch (error) {
        console.error('Error al actualizar servicio:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

module.exports = router;
