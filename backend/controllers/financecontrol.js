const db = require('../models');
const sendEmail = require('../config/mailer');

// Crear una nueva solicitud de financiación
exports.createFinance = async (req, res) => {
    try {
        const { vehicleId, term } = req.body;
        const userId = req.user.id;

        if (!vehicleId || !term) {
            return res.status(400).json({ error: 'Faltan datos: se requiere vehicleId y term.' });
        }

        const vehicle = await db.Vehicle.findByPk(vehicleId);
        if (!vehicle) {
            return res.status(404).json({ error: 'Vehículo no encontrado.' });
        }

        const user = await db.User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado.' });
        }

        const amount = vehicle.price;

        const newFinance = await db.Finance.create({
            amount,
            term,
            userId,
            vehicleId,
            status: 'received'
        });

        // Enviar correo de "solicitud recibida"
        const subject = 'Solicitud de financiación recibida';
        const html = `
            <h1>Hola ${user.username},</h1>
            <p>Hemos recibido tu solicitud de financiación para el vehículo ${vehicle.brand} ${vehicle.model}.</p>
            <p>Pronto nos pondremos en contacto contigo.</p>
            <p>Gracias por confiar en nosotros.</p>
        `;
        sendEmail(user.email, subject, html);

        res.status(201).json(newFinance);
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
};

// Obtener todas las solicitudes de financiación (admin)
exports.getAllFinances = async (req, res) => {
    try {
        const finances = await db.Finance.findAll({
            include: [
                { model: db.User, attributes: ['id', 'username', 'email'] },
                { model: db.Vehicle, attributes: ['id', 'brand', 'model', 'year'] }
            ]
        });
        res.status(200).json(finances);
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Actualizar el estado de una solicitud de financiación (admin)
exports.updateFinanceStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, appointmentDate } = req.body;

        const finance = await db.Finance.findByPk(id, {
            include: [
                { model: db.User, attributes: ['id', 'username', 'email'] },
                { model: db.Vehicle, attributes: ['id', 'brand', 'model'] }
            ]
        });

        if (!finance) {
            return res.status(404).json({ error: 'Solicitud de financiación no encontrada' });
        }

        const allowedStatus = ['approved', 'rejected'];
        if (!allowedStatus.includes(status)) {
            return res.status(400).json({ error: 'Estado no válido.' });
        }

        if (status === 'approved' && !appointmentDate) {
            return res.status(400).json({ error: 'La fecha de la cita es obligatoria para aprobar la solicitud.' });
        }

        finance.status = status;
        if (appointmentDate) {
            finance.appointmentDate = appointmentDate;
        }

        await finance.save();

        // Enviar correo de "solicitud aprobada/rechazada"
        let subject = '';
        let html = '';
        if (status === 'approved') {
            // Validar fecha
            const fechaCita = new Date(appointmentDate);
            if (isNaN(fechaCita.getTime())) {
                return res.status(400).json({ error: 'La fecha de la cita es inválida. Usa formato ISO (YYYY-MM-DDTHH:mm:ss).' });
            }
            subject = '¡Tu financiación fue aprobada!';
            html = `
                <h1>Hola ${finance.User.username},</h1>
                <p>Tu financiación para el vehículo ${finance.Vehicle.brand} ${finance.Vehicle.model} ha sido aprobada.</p>
                <p>Te esperamos el ${fechaCita.toLocaleDateString('es-AR')} a las ${fechaCita.toLocaleTimeString('es-AR')} en nuestra sucursal.</p>
                <p>¡Te esperamos!</p>
            `;
        } else { // rejected
            subject = 'Tu financiación fue rechazada';
            html = `
                <h1>Hola ${finance.User.username},</h1>
                <p>Lamentamos informarte que tu solicitud de financiación para el vehículo ${finance.Vehicle.brand} ${finance.Vehicle.model} ha sido rechazada.</p>
                <p>Para más información, no dudes en contactarnos.</p>
            `;
        }
        sendEmail(finance.User.email, subject, html);

        res.status(200).json(finance);
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
};

// Eliminar una solicitud de financiación (admin o dueño)
exports.deleteFinance = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const finance = await db.Finance.findByPk(id);
        if (!finance) {
            return res.status(404).json({ error: 'Solicitud de financiación no encontrada' });
        }
        // Permitir eliminar si es admin o dueño de la solicitud
        if (req.user.role !== 'admin' && req.user.role !== 'superadmin' && finance.userId !== userId) {
            return res.status(403).json({ error: 'No tienes permisos para eliminar esta solicitud.' });
        }
        await finance.destroy();
        res.json({ message: 'Solicitud de financiación eliminada correctamente.' });
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
};