const express = require('express');
const router = express.Router();
const { verifyJWT, isAdmin } = require('../middlewares/authmiddleware');
const serviceController = require('../controllers/servicecontrol');

// Ruta para solicitar un nuevo servicio
router.post('/', verifyJWT, async (req, res) => {
    try {
        const { type, date, comments, vehicleId } = req.body;
        const userId = req.user.id;
        const newService = await serviceController.createService({ type, date, comments, vehicleId, userId });
        res.status(201).json(newService);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Ruta para obtener todos los servicios (solo admin)
router.get('/', verifyJWT, isAdmin, async (req, res) => {
    try {
        const services = await serviceController.getAllServices();
        res.status(200).json(services);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Ruta para actualizar un servicio (solo admin)
router.put('/:id', verifyJWT, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { type, date, status, vehicleId } = req.body;
        const updatedService = await serviceController.updateService(id, { type, date, status, vehicleId });
        res.status(200).json(updatedService);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
