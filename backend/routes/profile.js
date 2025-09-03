const express = require('express');
const router = express.Router();
const { User, Finance, Vehicle, Service } = require('../models'); // Importar modelos necesarios
const authMiddleware = require('../middlewares/authmiddleware');

// @route   GET /api/profile
// @desc    Obtener el perfil del usuario autenticado
// @access  Privado
router.get('/', authMiddleware.verifyJWT, async (req, res) => {
    try {
        // El ID del usuario se obtiene del token JWT verificado por el middleware
        const userId = req.user.id;

        // Buscar al usuario en la base de datos por su ID
        const user = await User.findByPk(userId, {
            // Excluir el campo de la contraseña por seguridad
            attributes: { exclude: ['password'] }
        });

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Devolver los datos del perfil del usuario
        res.json(user);
    } catch (err) {
        
        console.error('Error al obtener el perfil:', err.message);
        res.status(500).send('Error del servidor');
    }
});

// @route   GET /api/profile/finances
// @desc    Obtener el historial de financiación del usuario autenticado
// @access  Privado
router.get('/finances', authMiddleware.verifyJWT, async (req, res) => {
    try {
        const userId = req.user.id;

        const financeHistory = await Finance.findAll({
            where: { userId: userId },
            include: [{
                model: Vehicle,
                attributes: ['brand', 'model', 'year'] // Solo incluir estos campos del vehículo
            }],
            order: [['createdAt', 'DESC']] // Ordenar por más reciente primero
        });

        res.json(financeHistory);
    } catch (err) {
        console.error('Error al obtener el historial de financiación:', err.message);
        res.status(500).send('Error del servidor');
    }
});

// @route   GET /api/profile/services
// @desc    Obtener el historial de turnos de taller del usuario autenticado
// @access  Privado
router.get('/services', authMiddleware.verifyJWT, async (req, res) => {
    try {
        const userId = req.user.id;

        const serviceHistory = await Service.findAll({
            where: { userId: userId },
            include: [{
                model: Vehicle,
                attributes: ['brand', 'model', 'year']
            }],
            order: [['date', 'DESC']] // Ordenar por fecha del turno
        });

        res.json(serviceHistory);
    } catch (err) {
        console.error('Error al obtener el historial de servicios:', err.message);
        res.status(500).send('Error del servidor');
    }
});

module.exports = router;
