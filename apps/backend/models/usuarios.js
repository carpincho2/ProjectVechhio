const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  const Usuario = sequelize.define('Usuario', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'El nombre es requerido'
        },
        len: {
          args: [2, 100],
          msg: 'El nombre debe tener entre 2 y 100 caracteres'
        }
      }
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: {
        msg: 'Este email ya está registrado'
      },
      validate: {
        isEmail: {
          msg: 'Por favor ingresa un email válido'
        },
        notEmpty: {
          msg: 'El email es requerido'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'La contraseña es requerida'
        },
        len: {
          args: [6, 100],
          msg: 'La contraseña debe tener al menos 6 caracteres'
        }
      }
    },
    rol: {
      type: DataTypes.ENUM('usuario', 'admin'),
      defaultValue: 'usuario',
      allowNull: false
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    ultimoLogin: {
      type: DataTypes.DATE
    }
  }, {
    timestamps: true,
    hooks: {
      beforeCreate: async (usuario) => {
        if (usuario.password) {
          const salt = await bcrypt.genSalt(10);
          usuario.password = await bcrypt.hash(usuario.password, salt);
        }
      },
      beforeUpdate: async (usuario) => {
        if (usuario.changed('password')) {
          const salt = await bcrypt.genSalt(10);
          usuario.password = await bcrypt.hash(usuario.password, salt);
        }
      }
    }
  });

  // Método para comparar contraseñas
  Usuario.prototype.compararPassword = async function(passwordIngresado) {
    return await bcrypt.compare(passwordIngresado, this.password);
  };

  return Usuario;
};