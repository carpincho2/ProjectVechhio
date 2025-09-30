const express = require('express');
const router = express.Router();
const { getFinanceStats, getVehicleStats, getServiceStats } = require('../controllers/statisticscontrol.js');
const { verifyJWT, isAdmin } = require('../middlewares/authmiddleware');

// Ruta para obtener estadísticas de financiación
router.get('/finances', verifyJWT, isAdmin, getFinanceStats);

// Ruta para obtener estadísticas de vehículos
router.get('/vehicles', verifyJWT, isAdmin, getVehicleStats);

// Ruta para obtener estadísticas de servicios
router.get('/services', verifyJWT, isAdmin, getServiceStats);

module.exports = router;
