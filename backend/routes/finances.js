const express = require('express');
const router = express.Router();
const financeController = require('../controllers/financecontrol');
const { verifyJWT, isAdmin } = require('../middlewares/authmiddleware');

// Rutas de financiación
router.post('/', verifyJWT, financeController.createFinance);
router.get('/', verifyJWT, isAdmin, financeController.getAllFinances);
router.put('/:id/status', verifyJWT, isAdmin, financeController.updateFinanceStatus);
router.delete('/:id', verifyJWT, financeController.deleteFinance);

module.exports = router;