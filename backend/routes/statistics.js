const express = require('express');
const router = express.Router();
const { getFinanceStats, getVehicleStats, getServiceStats } = require('../controllers/statisticscontrol.js');
const { verifyJWT, isAdmin } = require('../middlewares/authmiddleware');

// Nueva ruta para el dashboard (con todos los conteos)
router.get('/dashboard', verifyJWT, isAdmin, async (req, res) => {
    try {
        // Aquí deberías obtener los conteos de tu base de datos
        // Ejemplo genérico:
        const User = require('../models/User'); // Ajusta según tu modelo
        const Vehicle = require('../models/Vehicle'); // Ajusta según tu modelo
        
        const usersCount = await User.countDocuments();
        const vehiclesCount = await Vehicle.countDocuments();
        
        res.json({
            users: usersCount,
            vehicles: vehiclesCount
        });
    } catch (error) {
        console.error('Error obteniendo estadísticas del dashboard:', error);
        res.status(500).json({ error: 'Error al obtener estadísticas' });
    }
});

// Ruta para obtener estadísticas de financiación
router.get('/finances', verifyJWT, isAdmin, getFinanceStats);

// Ruta para obtener estadísticas de vehículos
router.get('/vehicles', verifyJWT, isAdmin, getVehicleStats);

// Ruta para obtener estadísticas de servicios
router.get('/services', verifyJWT, isAdmin, getServiceStats);