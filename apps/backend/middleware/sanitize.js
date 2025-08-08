const sanitizeInput = (req, res, next) => {
    // Función para sanitizar strings
    const sanitizeString = (str) => {
        if (typeof str === 'string') {
            return str.trim()
                .replace(/[<>]/g, '') // Elimina < y >
                .replace(/javascript:/gi, '') // Previene inyección de JavaScript
                .slice(0, 500); // Limita longitud
        }
        return str;
    };

    // Sanitizar body
    if (req.body) {
        Object.keys(req.body).forEach(key => {
            req.body[key] = sanitizeString(req.body[key]);
        });
    }

    // Sanitizar query params
    if (req.query) {
        Object.keys(req.query).forEach(key => {
            req.query[key] = sanitizeString(req.query[key]);
        });
    }

    next();
};

module.exports = sanitizeInput;
