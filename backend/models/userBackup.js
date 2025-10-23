
module.exports = (sequelize, DataTypes) => {
    const UserBackup = sequelize.define('UserBackup', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        googleId: {
            type: DataTypes.STRING,
        },
        role: {
            type: DataTypes.STRING,
        }
    }, {
        timestamps: true,
        tableName: 'users_backup'
    });

    return UserBackup;
};
