const jwt = require('jsonwebtoken');

// Middleware para verificar el token JWT
const verifyJWT = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    console.log('[DEBUG] verifyJWT - authHeader recibido:', authHeader);

    const token = authHeader && authHeader.split(' ')[1];
    console.log('[DEBUG] verifyJWT - Token extraído:', token);

    if (token == null) return res.status(401).json({ error: 'Acceso denegado: Token no proporcionado' });

    jwt.verify(token, process.env.JWT_SECRET || 'miclavesupersecreta', (err, user) => {
        console.log('[DEBUG] verifyJWT - Resultado de la verificación:');
        console.log('[DEBUG] verifyJWT - Error:', err);
        console.log('[DEBUG] verifyJWT - User (payload):', user);

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