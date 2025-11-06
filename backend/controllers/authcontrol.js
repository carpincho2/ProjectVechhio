const bcrypt = require('bcryptjs');
const { User, Sequelize } = require('../models');
const { successResponse, errorResponse, validateEmail, validatePassword, generateToken, withTransaction } = require('../utils');
const config = require('../config/config');

// Función de Registro
exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Validaciones
        if (!validateEmail(email)) {
            return errorResponse(res, 400, 'Email inválido');
        }
        if (!validatePassword(password)) {
            return errorResponse(res, 400, 'La contraseña debe tener al menos 8 caracteres, una letra y un número');
        }

        // Crear usuario con transacción
        const newUser = await withTransaction(async (t) => {
            const hashedPassword = await bcrypt.hash(password, 10);
            return await User.create(
                { username, email, password: hashedPassword },
                { transaction: t }
            );
        });

        return successResponse(res, 201, { userId: newUser.id }, 'Usuario registrado exitosamente');
    } catch (error) {
        if (error instanceof Sequelize.UniqueConstraintError) {
            return errorResponse(res, 409, 'El email o nombre de usuario ya existe');
        }
        return errorResponse(res, 500, 'Error al registrar usuario');
    }
};

// Función de Login
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Buscar usuario por username o email
        const user = await User.findOne({
            where: {
                [Sequelize.Op.or]: [{ username }, { email: username }]
            },
            attributes: ['id', 'username', 'password', 'role', 'email']
        });

        if (!user) {
            return errorResponse(res, 401, 'Credenciales incorrectas');
        }

        // Verificar contraseña
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return errorResponse(res, 401, 'Credenciales incorrectas');
        }

        // Generar token JWT
        const token = generateToken({
            id: user.id,
            role: user.role,
            username: user.username
        });

        return successResponse(res, 200, {
            token,
            user: {
                username: user.username,
                role: user.role,
                email: user.email
            }
        }, 'Login exitoso');
    } catch (error) {
        return errorResponse(res, 500, 'Error al iniciar sesión');
    }
};

// Funciones de check y logout
exports.checkAuth = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: ['id', 'username', 'role'] // No incluir datos sensibles
        });
        
        if (!user) {
            return res.status(401).json({ loggedIn: false });
        }

        res.json({ 
            loggedIn: true, 
            user: {
                id: user.id,
                username: user.username,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al verificar la autenticación' });
    }
};

exports.logout = (req, res) => {
    // En el futuro, aquí podríamos agregar el token a una lista negra
    res.json({ message: 'Logout exitoso.' });
};