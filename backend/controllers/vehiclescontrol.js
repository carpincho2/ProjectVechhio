const { Vehicle } = require('../models');
const { Op } = require('sequelize');
const fs = require('fs');
const path = require('path');

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
        if (condition) {
    where.condition = { [Op.like]: condition.trim().toLowerCase() };
}

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
        console.log('Iniciando creación de vehículo');
        console.log('Body:', req.body);
        console.log('File:', req.file);

        const { brand, model, year, price, condition, mileage, description } = req.body;
        
        // Validaciones
        if (!brand || !model || !year || !price || !condition) {
            return res.status(400).json({ 
                error: 'Faltan campos requeridos',
                required: ['brand', 'model', 'year', 'price', 'condition'],
                received: { brand, model, year, price, condition }
            });
        }

        let imageUrl = null;

        // Si hay un archivo subido, guardar su ruta
        if (req.file) {
            // En producción, las imágenes se guardarán en /tmp temporalmente
            imageUrl = req.file.filename; // Solo guardamos el nombre del archivo
            console.log('Archivo guardado:', imageUrl);
        }

        // Crear el vehículo
        const newVehicle = await Vehicle.create({ 
            brand, 
            model, 
            year: parseInt(year), 
            price: parseFloat(price), 
            condition, 
            mileage: mileage ? parseFloat(mileage) : null, 
            description,
            image: imageUrl 
        });

        console.log('Vehículo creado exitosamente:', newVehicle.id);
        res.status(201).json(newVehicle);
    } catch (error) {
        console.error('Error detallado al crear vehículo:', error);
        res.status(500).json({ 
            error: 'Error al crear el vehículo',
            details: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

// @desc    Actualizar un vehículo existente
// @route   PUT /api/vehicles/:id
// @access  Private (Admin)
const updateVehicle = async (req, res) => {
    try {
        const { brand, model, year, price, condition, mileage, description } = req.body;
        const vehicle = await Vehicle.findByPk(req.params.id);

        if (!vehicle) {
            return res.status(404).json({ error: 'Vehículo no encontrado' });
        }

        let imageUrl = vehicle.image; // Mantener la imagen existente por defecto

        // Si hay un nuevo archivo subido
        if (req.file) {
            // Si había una imagen anterior y no estamos en producción, intentar eliminarla
            if (vehicle.image && process.env.NODE_ENV !== 'production') {
                const oldImagePath = path.join(process.cwd(), 'uploads', vehicle.image);
                try {
                    if (fs.existsSync(oldImagePath)) {
                        fs.unlinkSync(oldImagePath);
                        console.log('Imagen anterior eliminada:', oldImagePath);
                    }
                } catch (error) {
                    console.error('Error al eliminar imagen anterior:', error);
                }
            }
            
            // Actualizar con el nombre del nuevo archivo
            imageUrl = req.file.filename;
            console.log('Nueva imagen guardada:', imageUrl);
        }

        const updatedData = { 
            brand, 
            model, 
            year, 
            price, 
            condition, 
            mileage, 
            description,
            image: imageUrl 
        };

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