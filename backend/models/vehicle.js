module.exports = (sequelize, DataTypes) => {
    const Vehicle = sequelize.define('Vehicle', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        brand: { // Marca
            type: DataTypes.STRING,
            allowNull: false
        },
        model: { // Modelo
            type: DataTypes.STRING,
            allowNull: false
        },
        year: { // Año
            type: DataTypes.INTEGER,
            allowNull: false
        },
        price: { // Precio
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        color: { // Color
            type: DataTypes.STRING,
            allowNull: true
        },
        mileage: { // Kilometraje
            type: DataTypes.INTEGER,
            allowNull: true
        },
        status: { // Estado (ej: "disponible", "vendido", "reservado")
            type: DataTypes.STRING,
            defaultValue: 'available'
        },
        condition: { // Condición (ej: "Nuevo", "Usado")
            type: DataTypes.STRING,
            allowNull: false
        },
        image: { // URL de la imagen
            type: DataTypes.STRING,
            allowNull: true
        },
        description: { // Descripción del vehículo
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, {
        timestamps: true,
        tableName: 'vehicles' // Nombre de la tabla en la DB
    });

    // Definir asociaciones
    Vehicle.associate = (models) => {
           Vehicle.hasMany(models.Finance, { foreignKey: 'vehicleId', onDelete: 'CASCADE', hooks: true });
           Vehicle.hasMany(models.Service, { foreignKey: 'vehicleId', onDelete: 'CASCADE', hooks: true });
    };

    return Vehicle;
};