module.exports = (sequelize, DataTypes) => {
    const Service = sequelize.define('Service', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        type: { // Tipo de servicio (ej: "mantenimiento", "reparacion")
            type: DataTypes.STRING,
            allowNull: false
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        status: {
            type: DataTypes.STRING,
            defaultValue: 'scheduled'
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users', // Nombre de la tabla a la que hace referencia
                key: 'id'
            }
        },
        vehicleId: { // Opcional: si el servicio es para un vehículo específico
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'vehicles', // Nombre de la tabla a la que hace referencia
                key: 'id'
            }
        }
    }, {
        timestamps: true,
        tableName: 'services'
    });

    // Opcional: Definir asociaciones si las hay
    Service.associate = (models) => {
        Service.belongsTo(models.User, { foreignKey: 'userId' });
        Service.belongsTo(models.Vehicle, { foreignKey: 'vehicleId' }); // Asumiendo que tienes un modelo Vehiculo
    };

    return Service;
};