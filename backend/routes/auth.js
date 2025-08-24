const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // Importar jsonwebtoken
const { User, Sequelize } = require('../models'); // Importa User y Sequelize (que contiene Op)
const router = express.Router();
const { verifyJWT } = require('../middlewares/authmiddleware'); // Importar verifyJWT

// Asegúrate de que JWT_SECRET esté definido en tus variables de entorno
if (!process.env.JWT_SECRET) {
    console.error('FATAL ERROR: JWT_SECRET no está definido. Por favor, configúralo en tu archivo .env');
    process.exit(1);
}

// Login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // 1. Buscar usuario por username o email
        const user = await User.findOne({
            where: {
                [Sequelize.Op.or]: [{ username: username }, { email: username }]
            }
        });

        // 2. Verificar si el usuario existe
        if (!user) {

            return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
        }

        // 3. Verificar contraseña
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
        }

        // 4. Generar token JWT
        const token = jwt.sign(
            { id: user.id, username: user.username, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' } // Token expira en 1 hora
        );

        // 5. Enviar token en la respuesta
        res.json({
            message: 'Login exitoso',
            token: token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Register
router.post('/register', async (req, res) => {
    try {
        const { username, email, password, confirm } = req.body;

        // Validaciones
        if (password !== confirm) {
            return res.status(400).json({ error: 'Las contraseñas no coinciden' });
        }

        // Verificar si el usuario ya existe
        const existingUser = await User.findOne({
            where: {
                [Sequelize.Op.or]: [{ username: username }, { email: email }]
            }
        });

        if (existingUser) {
            return res.status(409).json({ error: 'El usuario o email ya existe' });
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

        // Generar token JWT para el nuevo usuario
        const token = jwt.sign(
            { id: newUser.id, username: newUser.username, email: newUser.email, role: newUser.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' } // Token expira en 1 hora
        );

        // Enviar token en la respuesta
        res.status(201).json({
            message: 'Registro exitoso',
            token: token,
            user: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email,
                role: newUser.role
            }
        });

    } catch (error) {
        console.error('Error en registro:', error);
        // Si el error es por duplicado (ej. email o username ya existen)
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({ error: 'El usuario o email ya existe.' });
        }
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});



// Ruta para verificar el estado de login (ahora con JWT)
router.get('/check', verifyJWT, (req, res) => {
    res.json({
        loggedIn: true,
        user: req.user // Los datos del usuario vienen del token verificado
    });
});

// Ruta para cerrar sesión (con JWT, es principalmente una acción del cliente)
router.post('/logout', (req, res) => {
    // Con JWT, el logout es principalmente una acción del cliente (eliminar el token del localStorage)
    // En el backend, simplemente confirmamos que la solicitud fue recibida.
    res.json({ message: 'Sesión cerrada exitosamente (token eliminado del cliente)' });
});

module.exports = router;