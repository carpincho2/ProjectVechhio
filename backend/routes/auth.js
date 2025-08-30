const express = require('express');
const router = express.Router();
const authController = require('../controllers/authcontrol');
const { verifyJWT } = require('../middlewares/authmiddleware');

// Rutas de autenticación
router.post('/login', authController.login);
router.post('/register', authController.register);

// Ruta para el cambio de contraseña directo
router.post('/direct-reset-password', authController.directResetPassword);

// Rutas de verificación y logout
router.get('/check', verifyJWT, authController.checkAuth);
router.post('/logout', authController.logout);

module.exports = router;