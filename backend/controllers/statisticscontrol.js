const db = require('../models');

// Controlador para obtener estadísticas de financiación
const getFinanceStats = async (req, res) => {
    try {
        const [totalRequests, approvedRequests, pendingRequests, rejectedRequests] = await Promise.all([
            db.Finance.count(),
            db.Finance.count({ where: { status: 'approved' } }),
            db.Finance.count({ where: { status: 'pending' } }),
            db.Finance.count({ where: { status: 'rejected' } })
        ]);

        res.status(200).json({
            total: totalRequests,
            approved: approvedRequests,
            pending: pendingRequests,
            rejected: rejectedRequests
        });

    } catch (error) {
        console.error('Error al obtener estadísticas de financiación:', error);
        res.status(500).json({ error: 'Error interno del servidor al calcular las estadísticas.' });
    }
};

// Controlador para obtener estadísticas de vehículos
const getVehicleStats = async (req, res) => {
    try {
        const [totalVehicles, newVehicles, usedVehicles] = await Promise.all([
            db.Vehicle.count(),
            db.Vehicle.count({ where: { condition: 'Nuevo' } }),
            db.Vehicle.count({ where: { condition: 'Usado' } })
        ]);

        res.status(200).json({
            total: totalVehicles,
            new: newVehicles,
            used: usedVehicles
        });

    } catch (error) {
        console.error('Error al obtener estadísticas de vehículos:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
};

// Controlador para obtener estadísticas de servicios
const getServiceStats = async (req, res) => {
    try {
        const [totalServices, scheduledServices, completedServices, pendingServices] = await Promise.all([
            db.Service.count(),
            db.Service.count({ where: { status: 'scheduled' } }),
            db.Service.count({ where: { status: 'completed' } }),
            db.Service.count({ where: { status: 'pending' } })
        ]);

        res.status(200).json({
            total: totalServices,
            scheduled: scheduledServices,
            completed: completedServices,
            pending: pendingServices
        });

    } catch (error) {
        console.error('Error al obtener estadísticas de servicios:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
};

module.exports = {
    getFinanceStats,
    getVehicleStats,
    getServiceStats
};
