const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');

// La clave secreta debería estar en variables de entorno
const JWT_SECRET = process.env.JWT_SECRET || 'tu_clave_super_secreta';

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            throw new Error();
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        const usuario = await Usuario.findByPk(decoded.id);

        if (!usuario || !usuario.activo) {
            throw new Error();
        }

        req.token = token;
        req.usuario = usuario;
        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'Por favor autentícate'
        });
    }
};

module.exports = auth;
