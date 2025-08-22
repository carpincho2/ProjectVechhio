const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User'); // Asegurate de tener este modelo
const router = express.Router();

// Login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // 1. Buscar usuario por username o email
        const user = await User.findOne({
            where: {
                [Op.or]: [{ username: username }, { email: username }]
            }
        });

        // 2. Verificar si el usuario existe
        if (!user) {
            return res.redirect('/login.html?error=Usuario o contraseña incorrectos');
        }

        // 3. Verificar contraseña
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.redirect('/login.html?error=Usuario o contraseña incorrectos');
        }

        // 4. Crear sesión
        req.session.user = {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            loggedIn: true
        };

        // 5. Redirigir al home
        res.redirect('/');

    } catch (error) {
        console.error('Error en login:', error);
        res.redirect('/login.html?error=Error interno del servidor');
    }
});

// Register (ya lo tenés, pero lo mejoramos)
router.post('/register', async (req, res) => {
    try {
        const { username, email, password, confirm } = req.body;

        // Validaciones
        if (password !== confirm) {
            return res.redirect('/register.html?error=Las contraseñas no coinciden');
        }

        // Verificar si el usuario ya existe
        const existingUser = await User.findOne({
            where: {
                [Op.or]: [{ username: username }, { email: email }]
            }
        });

        if (existingUser) {
            return res.redirect('/register.html?error=El usuario o email ya existe');
        }

        // Hash de la contraseña
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Crear usuario en la base de datos
        const newUser = await User.create({
            username: username,
            email: email,
            password: hashedPassword,
            role: 'user'
        });

        // Crear sesión
        req.session.user = {
            id: newUser.id,
            username: newUser.username,
            email: newUser.email,
            role: newUser.role,
            loggedIn: true
        };

        res.redirect('/');

    } catch (error) {
        console.error('Error en registro:', error);
        res.redirect('/register.html?error=Error interno del servidor');
    }
});

// Las otras rutas (check, logout) las mantenemos igual
router.get('/check', (req, res) => {
    if (req.session.user && req.session.user.loggedIn) {
        res.json({ 
            loggedIn: true, 
            user: req.session.user 
        });
    } else {
        res.json({ loggedIn: false });
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error al cerrar sesión:', err);
            return res.redirect('/?error=Error al cerrar sesión');
        }
        res.redirect('/');
    });
});

module.exports = router;