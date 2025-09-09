module.exports = (sequelize, DataTypes) => {
    const Finance = sequelize.define('Finance', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        amount: { // Monto del vehículo al momento de la solicitud
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        term: { // Plazo en meses
            type: DataTypes.INTEGER,
            allowNull: false
        },
        status: {
            type: DataTypes.STRING,
            defaultValue: 'pending'
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Users', // Nombre de la tabla a la que hace referencia
                key: 'id'
            }
        },
        vehicleId: { // ID del vehículo que se está financiando
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'vehicles', // Nombre de la tabla a la que hace referencia
                key: 'id'
            }
        }
    }, {
        timestamps: true,
        tableName: 'finances'
    });

    // Definir asociaciones
    Finance.associate = (models) => {
        Finance.belongsTo(models.User, { foreignKey: 'userId' });
        Finance.belongsTo(models.Vehicle, { foreignKey: 'vehicleId' });
    };

    return Finance;
};