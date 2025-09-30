const express = require('express');
const router = express.Router();
const { verifyJWT, isAdmin } = require('../middlewares/authmiddleware');
const serviceController = require('../controllers/servicecontrol');

// Ruta para solicitar un nuevo servicio
router.post('/', verifyJWT, serviceController.createService);

// Ruta para obtener todos los servicios (solo admin)
router.get('/', verifyJWT, isAdmin, serviceController.getAllServices);

// Ruta para actualizar un servicio (solo admin)
router.put('/:id', verifyJWT, isAdmin, serviceController.updateService);

module.exports = router;
