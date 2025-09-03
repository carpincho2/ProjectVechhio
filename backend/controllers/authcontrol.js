const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, Sequelize } = require('../models');

// Función de Registro
exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ username, email, password: hashedPassword });
        res.status(201).json({ message: 'Usuario registrado exitosamente.', userId: newUser.id });
    } catch (error) {
        if (error instanceof Sequelize.UniqueConstraintError) {
            return res.status(409).json({ error: 'El email o nombre de usuario ya existe.' });
        }
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Función de Login
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ 
            where: { 
                [Sequelize.Op.or]: [{ username: username }, { email: username }] 
            }
        });

        if (!user) {
            return res.status(401).json({ error: 'Credenciales incorrectas.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Credenciales incorrectas.' });
        }

        console.log('[DEBUG] authcontrol.js - Usando JWT_SECRET para firmar:', process.env.JWT_SECRET || 'miclavesupersecreta');
        const token = jwt.sign({ id: user.id, role: user.role, username: user.username }, process.env.JWT_SECRET || 'miclavesupersecreta', {
            expiresIn: '24h'
        });

        res.json({ 
            message: 'Login exitoso', 
            token, 
            user: { username: user.username, role: user.role } 
        });
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Reseteo Directo y No Seguro
exports.directResetPassword = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'El nombre de usuario y la nueva contraseña son obligatorios.' });
        }

        const user = await User.findOne({ where: { username: username } });

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado.' });
        }

        // Actualizar contraseña
        const hashedPassword = await bcrypt.hash(password, 10);
        await user.update({
            password: hashedPassword
        });

        res.status(200).json({ message: `Contraseña para el usuario '${username}' actualizada exitosamente.` });

    } catch (error) {
        console.error('[ERROR] en directResetPassword:', error);
        res.status(500).json({ error: 'Error al restablecer la contraseña.' });
    }
};

// Funciones de check y logout
exports.checkAuth = (req, res) => {
    res.json({ loggedIn: true, user: req.user });
};

exports.logout = (req, res) => {
    res.json({ message: 'Logout exitoso.' });
};