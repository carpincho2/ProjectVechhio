const Usuario = require('../models/usuarios.js');
const catchAsync = require('../utils/catchAsync');
const { ValidationError, NotFoundError } = require('../utils/errors/AppError');

// Obtener todos los usuarios
exports.obtenerUsuarios = catchAsync(async (req, res) => {
    const usuarios = await Usuario.findAll();
    
    res.json({
        success: true,
        data: usuarios,
        count: usuarios.length
    });
});

// Obtener usuario por ID
exports.obtenerUsuarioPorId = catchAsync(async (req, res) => {
    const usuario = await Usuario.findByPk(req.params.id);
    
    if (!usuario) {
        throw new NotFoundError('No se encontró el usuario especificado');
    }

    res.json({
        success: true,
        data: usuario
    });
});

// Crear nuevo usuario
exports.crearUsuario = catchAsync(async (req, res) => {
    if (!req.body.nombre || !req.body.email || !req.body.password) {
        throw new ValidationError('Por favor proporcione nombre, email y contraseña');
    }

    const nuevoUsuario = await Usuario.create(req.body);
    
    // No enviar la contraseña en la respuesta
    nuevoUsuario.password = undefined;

    res.status(201).json({
        success: true,
        data: nuevoUsuario,
        message: 'Usuario creado exitosamente'
    });
});

// Actualizar usuario
exports.actualizarUsuario = catchAsync(async (req, res) => {
    const usuario = await Usuario.findByPk(req.params.id);
    
    if (!usuario) {
        throw new NotFoundError('No se encontró el usuario especificado');
    }

    // Evitar actualización de campos sensibles
    delete req.body.password;
    delete req.body.rol;

    await usuario.update(req.body);

    res.json({
        success: true,
        data: usuario,
        message: 'Usuario actualizado exitosamente'
    });
});

// Eliminar usuario
exports.eliminarUsuario = catchAsync(async (req, res) => {
    const usuario = await Usuario.findByPk(req.params.id);
    
    if (!usuario) {
        throw new NotFoundError('No se encontró el usuario especificado');
    }

    await usuario.destroy();

    res.json({
        success: true,
        message: 'Usuario eliminado exitosamente'
    });
});
