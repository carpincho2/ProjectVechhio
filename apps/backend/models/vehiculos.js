const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * @swagger
 * components:
 *   schemas:
 *     Vehiculo:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID autoincremental del vehículo
 *         marca:
 *           type: string
 *           description: Marca del vehículo
 *         modelo:
 *           type: string
 *           description: Modelo del vehículo
 *         año:
 *           type: integer
 *           description: Año de fabricación del vehículo
 *         precio:
 *           type: number
 *           format: float
 *           description: Precio del vehículo
 *         kilometraje:
 *           type: integer
 *           description: Kilometraje del vehículo
 *         color:
 *           type: string
 *           description: Color del vehículo
 *         transmision:
 *           type: string
 *           enum: [manual, automática]
 *           description: Tipo de transmisión del vehículo
 *         combustible:
 *           type: string
 *           enum: [gasolina, diesel, eléctrico, híbrido]
 *           description: Tipo de combustible del vehículo
 *         disponible:
 *           type: boolean
 *           description: Disponibilidad del vehículo
 *         descripcion:
 *           type: string
 *           description: Descripción del vehículo
 *         imagenUrl:
 *           type: string
 *           description: URL de la imagen del vehículo
 *       required:
 *         - marca
 *         - modelo
 *         - año
 *         - precio
 *         - kilometraje
 *         - color
 *         - transmision
 *         - combustible
 */
const Vehiculo = sequelize.define('Vehiculo', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  marca: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'La marca es requerida'
      }
    }
  },
  modelo: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El modelo es requerido'
      }
    }
  },
  año: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isInt: {
        msg: 'El año debe ser un número entero'
      },
      min: {
        args: [1900],
        msg: 'El año debe ser mayor a 1900'
      },
      max: {
        args: [2030],
        msg: 'El año no puede ser mayor a 2030'
      }
    }
  },
  precio: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      isDecimal: {
        msg: 'El precio debe ser un número válido'
      },
      min: {
        args: [0],
        msg: 'El precio no puede ser negativo'
      }
    }
  },
  kilometraje: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      isInt: {
        msg: 'El kilometraje debe ser un número entero'
      },
      min: {
        args: [0],
        msg: 'El kilometraje no puede ser negativo'
      }
    }
  },
  color: {
    type: DataTypes.STRING(30),
    allowNull: false
  },
  transmision: {
    type: DataTypes.ENUM('manual', 'automática'),
    allowNull: false
  },
  combustible: {
    type: DataTypes.ENUM('gasolina', 'diesel', 'eléctrico', 'híbrido'),
    allowNull: false
  },
  disponible: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  descripcion: {
    type: DataTypes.TEXT
  },
  imagenUrl: {
    type: DataTypes.STRING,
    validate: {
      isUrl: {
        msg: 'La URL de la imagen no es válida'
      }
    }
  }
}, {
  timestamps: true
});

module.exports = Vehiculo;