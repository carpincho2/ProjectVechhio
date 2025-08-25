const jwt = require('jsonwebtoken');

// Middleware para verificar el token JWT
const verifyJWT = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.status(401).json({ error: 'Acceso denegado: Token no proporcionado' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Acceso denegado: Token inválido o expirado' });
        req.user = user; // Adjuntar el payload del token al objeto request
        next();
    });
};

// Middleware para verificar si el usuario es administrador
function isAdmin(req, res, next) {
  // Asume que verifyJWT ya ha adjuntado req.user
  if (req.user && (req.user.role === 'admin' || req.user.role === 'superadmin')) {
    next();
  } else {
    res.status(403).json({ error: 'Acceso denegado: Se requiere rol de administrador' });
  }
}

// Middleware para verificar si el usuario es superadministrador
function isSuperAdmin(req, res, next) {
  // Asume que verifyJWT ya ha adjuntado req.user
  if (req.user && req.user.role === 'superadmin') {
    next();
  } else {
    res.status(403).json({ error: 'Acceso denegado: Se requiere rol de superadministrador' });
  }
}

module.exports = { verifyJWT, isAdmin, isSuperAdmin };
