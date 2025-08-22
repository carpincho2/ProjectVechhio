const express = require('express');
const router = express.Router();
const db = require('../models'); // Importa la instancia de la base de datos
const { isAdmin } = require('../middlewares/authmiddleware'); // Importa el middleware isAdmin

// Ruta para crear una nueva solicitud de financiación (solo admin)
router.post('/', isAdmin, async (req, res) => {
    try {
        const { amount, term, userId } = req.body; // Ejemplo de campos
        const newFinance = await db.Finance.create({ amount, term, userId });
        res.status(201).json(newFinance);
    } catch (error) {
        console.error('Error al crear solicitud de financiación:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Ruta para obtener todas las solicitudes de financiación (solo admin)
router.get('/', isAdmin, async (req, res) => {
    try {
        const finances = await db.Finance.findAll();
        res.status(200).json(finances);
    } catch (error) {
        console.error('Error al obtener solicitudes de financiación:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

module.exports = router;
