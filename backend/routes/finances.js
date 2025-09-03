const express = require('express');
const router = express.Router();
const db = require('../models'); // Importa la instancia de la base de datos
const { verifyJWT, isAdmin } = require('../middlewares/authmiddleware'); // Importa los middlewares de autenticación

// Ruta para que un usuario autenticado cree una nueva solicitud de financiación para un vehículo específico
router.post('/', verifyJWT, async (req, res) => {
    try {
        const { vehicleId, term } = req.body; // Se obtienen vehicleId y plazo del cuerpo
        const userId = req.user.id; // El ID del usuario se obtiene del token JWT

        // 1. Validar que los datos necesarios están presentes
        if (!vehicleId || !term) {
            return res.status(400).json({ error: 'Faltan datos: se requiere vehicleId y term.' });
        }

        // 2. Buscar el vehículo en la base de datos para obtener su precio
        const vehicle = await db.Vehicle.findByPk(vehicleId);
        if (!vehicle) {
            return res.status(404).json({ error: 'Vehículo no encontrado.' });
        }

        // 3. Usar el precio del vehículo como el monto de la financiación
        const amount = vehicle.price;

        // 4. Crear la nueva solicitud de financiación
        const newFinance = await db.Finance.create({
            amount,
            term,
            userId,
            vehicleId
        });

        res.status(201).json(newFinance);

    } catch (error) {
        console.error('Error al crear solicitud de financiación:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

// Ruta para obtener todas las solicitudes de financiación (solo admin)
router.get('/', verifyJWT, isAdmin, async (req, res) => {
    try {
        const finances = await db.Finance.findAll();
        res.status(200).json(finances);
    } catch (error) {
        console.error('Error al obtener solicitudes de financiación:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Ruta para actualizar una solicitud de financiación (solo admin)
router.put('/:id', verifyJWT, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { amount, term, userId } = req.body;

        const finance = await db.Finance.findByPk(id);
        if (!finance) {
            return res.status(404).json({ error: 'Solicitud de financiación no encontrada' });
        }

        await finance.update({ amount, term, userId });
        res.status(200).json(finance);
    } catch (error) {
        console.error('Error al actualizar solicitud de financiación:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

module.exports = router;
