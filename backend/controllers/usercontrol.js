const { User } = require('../models');

// @desc    Obtener todos los usuarios
// @route   GET /api/users
// @access  Private (SuperAdmin)
const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password'] } // Nunca devolver la contraseña
        });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los usuarios: ' + error.message });
    }
};

// @desc    Actualizar el rol de un usuario
// @route   PUT /api/users/:id/role
// @access  Private (SuperAdmin)
const updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;
        const userId = req.params.id;

        // Validar que el rol sea uno de los permitidos
        if (!['user', 'admin', 'superadmin'].includes(role)) {
            return res.status(400).json({ error: 'Rol no válido.' });
        }

        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Un superadmin no puede ser degradado por otro
        if (user.role === 'superadmin' && req.user.id !== user.id) { // Asumiendo que un superadmin no puede degradar a otro
            // O podrías permitirlo, pero evitemos que se quiten el rol a sí mismos por accidente
            if(req.user.id === user.id && role !== 'superadmin'){
                 return res.status(403).json({ error: 'No puedes remover tu propio rol de superadministrador.' });
            }
        }

        user.role = role;
        await user.save();

        const { password, ...userWithoutPassword } = user.get();

        res.status(200).json(userWithoutPassword);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el rol del usuario: ' + error.message });
    }
};

// @desc    Eliminar un usuario
// @route   DELETE /api/users/:id
// @access  Private (SuperAdmin)
const deleteUser = async (req, res) => {
    try {
        const userIdToDelete = req.params.id;
        const currentUserId = req.user.id;

        // Un superadmin no puede eliminarse a sí mismo
        if (userIdToDelete == currentUserId) {
            return res.status(403).json({ error: 'Acción no permitida: no puedes eliminar tu propia cuenta.' });
        }

        const user = await User.findByPk(userIdToDelete);

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        await user.destroy();

        res.status(200).json({ message: 'Usuario eliminado correctamente.' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el usuario: ' + error.message });
    }
};

module.exports = {
    getAllUsers,
    updateUserRole,
    deleteUser
};