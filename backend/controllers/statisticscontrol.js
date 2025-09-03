const db = require('../models');

// Controlador para obtener estadísticas de financiación
const getFinanceStats = async (req, res) => {
    try {
        // Usamos Promise.all para ejecutar todas las consultas de conteo en paralelo
        const [totalRequests, approvedRequests, pendingRequests, rejectedRequests] = await Promise.all([
            db.Finance.count(),
            db.Finance.count({ where: { status: 'approved' } }),
            db.Finance.count({ where: { status: 'pending' } }),
            db.Finance.count({ where: { status: 'rejected' } })
        ]);

        // Devolvemos un objeto JSON con todas las estadísticas
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

module.exports = {
    getFinanceStats
};
