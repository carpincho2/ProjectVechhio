const { Service, User, Vehicle } = require('../models');
const sendEmail = require('../config/mailer');

// @desc    Crear una nueva solicitud de servicio
// @route   POST /api/services
// @access  Private
exports.createService = async (req, res) => {
    try {
        const { type, date, vehicleId } = req.body;
        const userId = req.user.id; // Se obtiene del token JWT

        if (!type || !date) {
            return res.status(400).json({ error: 'El tipo y la fecha del servicio son obligatorios.' });
        }
        // Validar fecha futura
        if (new Date(date) < new Date()) {
            return res.status(400).json({ error: 'La fecha debe ser futura.' });
        }
        // Validar tipo de servicio
        const validTypes = [
            'Mantenimiento Preventivo',
            'Revisión Completa',
            'Frenos y Suspensión',
            'Cambio de Aceite',
            'Reparación General'
        ];
        if (!validTypes.includes(type.trim())) {
            return res.status(400).json({ error: 'Tipo de servicio no válido.' });
        }

        // Verificar que el usuario del token exista en la base de datos
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(400).json({ error: 'Usuario asociado al token no existe.' });
        }

        // Si se proporciona vehicleId, verificar que exista para evitar FK constraint
        if (vehicleId) {
            const vehicle = await Vehicle.findByPk(vehicleId);
            if (!vehicle) {
                return res.status(400).json({ error: 'Vehículo no encontrado.' });
            }
        }

        const newService = await Service.create({ type, date, vehicleId, userId, status: 'scheduled' });

        // Obtener datos del usuario para el mail (ya lo tenemos en `user`)
        if (user && user.email) {
            try {
                const subject = 'Confirmación de turno de servicio';
                const html = `<h2>¡Hola ${user.username}!</h2>
                <p>Tu turno de <b>${type}</b> ha sido reservado para el día <b>${date}</b>.</p>
                <p>Si tienes dudas, responde este correo.</p>`;
                // Intentar enviar el mail sin bloquear la respuesta al cliente
                sendEmail(user.email, subject, html);
            } catch (mailErr) {
                console.error('Error enviando email de confirmación:', mailErr);
                // No abortamos la operación por fallo de mail
            }
        }

        res.status(201).json(newService);
    } catch (error) {
        console.error('createService error:', error);
        res.status(500).json({ error: error.message || 'Error interno del servidor' });
    }
};

// @desc    Obtener todos los servicios con paginación y filtro por estado
// @route   GET /api/services
// @access  Private (Admin)
exports.getAllServices = async (req, res) => {
    try {
        const { page = 1, limit = 10, status } = req.query;
        const offset = (parseInt(page) - 1) * parseInt(limit);
        const where = status ? { status } : {};
        const services = await Service.findAndCountAll({
            where,
            include: [
                { model: User, attributes: ['id', 'username'] },
                { model: Vehicle, attributes: ['id', 'brand', 'model'] }
            ],
            limit: parseInt(limit),
            offset
        });
        res.status(200).json({
            total: services.count,
            page: parseInt(page),
            pages: Math.ceil(services.count / limit),
            data: services.rows
        });
    } catch (error) {
        console.error('getAllServices error:', error);
        res.status(500).json({ error: error.message || 'Error interno del servidor' });
    }
};

// @desc    Actualizar un servicio
// @route   PUT /api/services/:id
// @access  Private (Admin)
exports.updateService = async (req, res) => {
    try {
        const { id } = req.params;
        const { type, date, status } = req.body;

        const service = await Service.findByPk(id);
        if (!service) {
            return res.status(404).json({ error: 'Servicio no encontrado' });
        }

        // Actualizar solo los campos que se envían
        service.type = type || service.type;
        service.date = date || service.date;
        service.status = status || service.status;

        await service.save();
        res.status(200).json(service);
    } catch (error) {
        console.error('updateService error:', error);
        res.status(500).json({ error: error.message || 'Error interno del servidor' });
    }
};