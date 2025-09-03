const express = require('express');
const router = express.Router();
const { getFinanceStats } = require('../controllers/statisticscontrol.js');
const { verifyJWT, isAdmin } = require('../middlewares/authmiddleware');

// Ruta para obtener estadísticas de financiación
// Solo accesible para administradores autenticados
router.get('/finances', verifyJWT, isAdmin, getFinanceStats);

module.exports = router;
