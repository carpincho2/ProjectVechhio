module.exports = (sequelize, DataTypes) => {
    const Finance = sequelize.define('Finance', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        amount: {
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
        }
    }, {
        timestamps: true,
        tableName: 'finances'
    });

    // Opcional: Definir asociaciones si las hay
    Finance.associate = (models) => {
        Finance.belongsTo(models.User, { foreignKey: 'userId' });
    };

    return Finance;
};
