const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const authController = require('../controllers/authcontrol');
const { verifyJWT } = require('../middlewares/authmiddleware');

// Rutas de autenticación local
router.post('/login', authController.login);
router.post('/register', authController.register);

// Rutas de autenticación de Google
router.get('/google', (req, res, next) => {
    passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
});

// Callback de Google: al autenticarse correctamente, generamos un JWT y redirigimos
// a la página estática `auth-success.html` que guardará el token en localStorage.
router.get('/google/callback', 
    passport.authenticate('google', { failureRedirect: '/login.html' }),
    (req, res) => {
        // req.user fue establecido por Passport
        if (!req.user) {
            return res.redirect('/login.html');
        }

        // Generar JWT con la misma estructura que el login local
        const token = jwt.sign({ id: req.user.id, role: req.user.role, username: req.user.username }, process.env.JWT_SECRET || 'miclavesupersecreta', { expiresIn: '24h' });

        // Redirigir a la página que almacenará el token en localStorage y redirigirá al panel o index según rol
        res.redirect(`/auth-success.html?token=${token}`);
    }
);

// Rutas de verificación y logout
router.get('/check', verifyJWT, authController.checkAuth);
router.post('/logout', authController.logout);

module.exports = router;