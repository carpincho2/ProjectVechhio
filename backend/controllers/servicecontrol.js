const { Service, User, Vehicle } = require('../models');

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

        const newService = await Service.create({ type, date, vehicleId, userId, status: 'scheduled' });
        res.status(201).json(newService);
    } catch (error) {
        console.error('Error al crear servicio:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// @desc    Obtener todos los servicios
// @route   GET /api/services
// @access  Private (Admin)
exports.getAllServices = async (req, res) => {
    try {
        const services = await Service.findAll({
            include: [
                { model: User, attributes: ['id', 'username'] },
                { model: Vehicle, attributes: ['id', 'brand', 'model'] }
            ]
        });
        res.status(200).json(services);
    } catch (error) {
        console.error('Error al obtener servicios:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
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
        console.error('Error al actualizar servicio:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};