const express = require('express');
const router = express.Router();
const { getAllUsers, updateUserRole, deleteUser } = require('../controllers/usercontrol.js');
const { verifyJWT, isSuperAdmin } = require('../middlewares/authmiddleware.js');

// @route   GET /api/users
// @desc    Obtener todos los usuarios
// @access  Private (SuperAdmin)
router.get('/', [verifyJWT, isSuperAdmin], getAllUsers);

// @route   PUT /api/users/:id/role
// @desc    Actualizar el rol de un usuario
// @access  Private (SuperAdmin)
router.put('/:id/role', [verifyJWT, isSuperAdmin], updateUserRole);

// @route   DELETE /api/users/:id
// @desc    Eliminar un usuario
// @access  Private (SuperAdmin)
router.delete('/:id', [verifyJWT, isSuperAdmin], deleteUser);

module.exports = router;
