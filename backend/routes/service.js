const express = require('express');
const router = express.Router();
const { verifyJWT, isAdmin } = require('../middlewares/authmiddleware');
const serviceController = require('../controllers/servicecontrol');

// Ruta para solicitar un nuevo servicio
router.post('/', verifyJWT, serviceController.createService);

// Ruta para obtener todos los servicios (solo admin)
router.get('/', verifyJWT, isAdmin, serviceController.getAllServices);

// Ruta para obtener un servicio específico (solo admin)
router.get('/:id', verifyJWT, isAdmin, serviceController.getService);

// Ruta para actualizar un servicio (solo admin)
router.put('/:id', verifyJWT, isAdmin, serviceController.updateService);

// Ruta para eliminar un servicio (solo admin)
router.delete('/:id', verifyJWT, isAdmin, serviceController.deleteService);

module.exports = router;
