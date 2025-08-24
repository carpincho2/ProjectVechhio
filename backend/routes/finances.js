const express = require('express');
const router = express.Router();
const db = require('../models'); // Importa la instancia de la base de datos
const { verifyJWT, isAdmin } = require('../middlewares/authmiddleware'); // Importa los middlewares de autenticación

// Ruta para crear una nueva solicitud de financiación (solo admin)
router.post('/', verifyJWT, isAdmin, async (req, res) => {
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
