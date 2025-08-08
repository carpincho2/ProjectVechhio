const Vehiculo = require('../models/vehiculos.js');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/errors/AppError');

exports.getVehiculos = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 10, sort, ...query } = req.query;
  const offset = (page - 1) * limit;

  const where = {};
  if (query.marca) where.marca = query.marca;
  if (query.modelo) where.modelo = query.modelo;
  if (query.año) where.año = query.año;

  const order = [];
  if (sort) {
    const sortFields = sort.split(',');
    sortFields.forEach(field => {
      const orderDirection = field.startsWith('-') ? 'DESC' : 'ASC';
      const fieldName = field.replace('-', '');
      order.push([fieldName, orderDirection]);
    });
  }

  const { count, rows: vehiculos } = await Vehiculo.findAndCountAll({
    where,
    limit: parseInt(limit),
    offset: parseInt(offset),
    order,
  });

  if (!vehiculos) {
    return next(new AppError('No se encontraron vehículos', 404));
  }

  res.status(200).json({
    status: 'success',
    results: vehiculos.length,
    total: count,
    data: {
      vehiculos,
    },
  });
});

// Crear vehículo de prueba
exports.crearVehiculoPrueba = async (req, res) => {
  try {
    const vehiculo = await Vehiculo.create({
      marca: 'Toyota',
      modelo: 'Corolla',
      año: 2022,
      precio: 35000,
      disponible: true
    });
    res.json({ success: true, data: vehiculo });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
