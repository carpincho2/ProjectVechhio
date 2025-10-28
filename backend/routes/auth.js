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

router.get('/google/callback', (req, res, next) => {
    passport.authenticate('google', { failureRedirect: '/login.html' })(req, res, () => {
        // Successful auth, redirect to panel
        res.redirect('/panel-control');
    });
});

// Rutas de verificación y logout
router.get('/check', verifyJWT, authController.checkAuth);
router.post('/logout', authController.logout);

module.exports = router;