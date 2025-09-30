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
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', 
    passport.authenticate('google', { failureRedirect: '/login.html', session: false }),
    (req, res) => {
        // El usuario ha sido autenticado por Google gracias a la estrategia de passport
        const user = req.user;
        
        // Generar un token JWT
        const token = jwt.sign(
            { id: user.id, role: user.role, username: user.username }, 
            process.env.JWT_SECRET || 'miclavesupersecreta', 
            { expiresIn: '24h' }
        );

        // Redirigir al frontend a una página de éxito que guardará el token
        res.redirect(`/auth-success.html?token=${token}`);
    }
);

// Rutas de verificación y logout
router.get('/check', verifyJWT, authController.checkAuth);
router.post('/logout', authController.logout);

module.exports = router;