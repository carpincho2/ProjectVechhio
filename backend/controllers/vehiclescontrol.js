const { Vehicle } = require('../models');
const { Op } = require('sequelize');

// @desc    Obtener todos los vehículos con filtros
// @route   GET /api/vehicles
// @access  Public
const getAllVehicles = async (req, res) => {
    try {
        const { brand, model, year, price, condition } = req.query;
        const where = {};

        if (brand) where.brand = brand;
        if (model) where.model = model;
        if (year) where.year = year;
        if (condition) where.condition = condition;

        if (price) {
            const [minPrice, maxPrice] = price.split('-').map(Number);
            if (!isNaN(minPrice) && !isNaN(maxPrice)) {
                where.price = {
                    [Op.between]: [minPrice, maxPrice]
                };
            } else if (!isNaN(minPrice)) {
                where.price = {
                    [Op.gte]: minPrice
                };
            }
        }

        const vehicles = await Vehicle.findAll({ where });
        res.status(200).json(vehicles);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los vehículos: ' + error.message });
    }
};

// @desc    Obtener un vehículo por su ID
// @route   GET /api/vehicles/:id
// @access  Public
const getVehicleById = async (req, res) => {
    try {
        const vehicle = await Vehicle.findByPk(req.params.id);
        if (vehicle) {
            res.status(200).json(vehicle);
        } else {
            res.status(404).json({ error: 'Vehículo no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el vehículo: ' + error.message });
    }
};

// @desc    Añadir un nuevo vehículo
// @route   POST /api/vehicles
// @access  Private (Admin)
const createVehicle = async (req, res) => {
    try {
        const { brand, model, year, price, condition, mileage, description } = req.body;
        const image = req.file ? req.file.filename : null;
        const newVehicle = await Vehicle.create({ brand, model, year, price, condition, mileage, description, image });
        res.status(201).json(newVehicle);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el vehículo: ' + error.message });
    }
};

// @desc    Actualizar un vehículo existente
// @route   PUT /api/vehicles/:id
// @access  Private (Admin)
const updateVehicle = async (req, res) => {
    try {
        const { brand, model, year, price, condition, mileage, description } = req.body;
        const image = req.file ? req.file.filename : null;
        const vehicle = await Vehicle.findByPk(req.params.id);

        if (!vehicle) {
            return res.status(404).json({ error: 'Vehículo no encontrado' });
        }

        const updatedData = { brand, model, year, price, condition, mileage, description };
        if (image) {
            updatedData.image = image;
        }

        await vehicle.update(updatedData);
        res.status(200).json(vehicle);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el vehículo: ' + error.message });
    }
};

// @desc    Eliminar un vehículo
// @route   DELETE /api/vehicles/:id
// @access  Private (Admin)
const deleteVehicle = async (req, res) => {
    try {
        const vehicle = await Vehicle.findByPk(req.params.id);
        if (!vehicle) {
            return res.status(404).json({ error: 'Vehículo no encontrado' });
        }
        await vehicle.destroy();
        res.status(200).json({ message: 'Vehículo eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el vehículo: ' + error.message });
    }
};

module.exports = {
    getAllVehicles,
    getVehicleById,
    createVehicle,
    updateVehicle,
    deleteVehicle
};