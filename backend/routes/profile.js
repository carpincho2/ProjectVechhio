const express = require('express');
const router = express.Router();
const { User } = require('../models'); // Importar el modelo User
const authMiddleware = require('../middlewares/authmiddleware');

// @route   GET /api/profile
// @desc    Obtener el perfil del usuario autenticado
// @access  Privado
router.get('/', authMiddleware.verifyJWT, async (req, res) => {
    try {
        // El ID del usuario se obtiene del token JWT verificado por el middleware
        const userId = req.user.id;

        // Buscar al usuario en la base de datos por su ID
        const user = await User.findByPk(userId, {
            // Excluir el campo de la contraseña por seguridad
            attributes: { exclude: ['password'] }
        });

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Devolver los datos del perfil del usuario
        res.json(user);
    } catch (err) {
        
        console.error('Error al obtener el perfil:', err.message);
        res.status(500).send('Error del servidor');
    }
});

module.exports = router;
