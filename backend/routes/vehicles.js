const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const db = require('../models'); // Importa la instancia de la base de datos
const { verifyJWT, isAdmin } = require('../middlewares/authmiddleware'); // Importa los middlewares de autenticación
const vehicleController = require('../controllers/vehiclescontrol');

// Configuración de Multer para guardar las imágenes
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Nombre de archivo único
    }
});

const upload = multer({ storage: storage });

// Ruta para obtener todos los vehículos
router.get('/', vehicleController.getAllVehicles);

// Ruta para obtener un vehículo por ID
router.get('/:id', verifyJWT, isAdmin, async (req, res) => {
    try {
        const vehicle = await db.Vehiculo.findByPk(req.params.id);
        if (!vehicle) {
            return res.status(404).json({ error: 'Vehículo no encontrado' });
        }
        res.status(200).json(vehicle);
    } catch (error) {
        console.error('Error al obtener vehículo por ID:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Ruta para crear un nuevo vehículo (solo admin)

router.post('/', verifyJWT, isAdmin, upload.single('image'), async (req, res) => {
    try {
        const { brand, model, year, price, color, mileage, status, condition, description } = req.body;
        const image = req.file ? `/uploads/${req.file.filename}` : null;
        const newVehicle = await db.Vehiculo.create({ brand, model, year, price, color, mileage, status, condition, description, image });
        res.status(201).json(newVehicle);
    } catch (error) {
        console.error('Error al crear vehículo:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Ruta para actualizar un vehículo (solo admin)
router.put('/:id', verifyJWT, isAdmin, upload.single('image'), async (req, res) => {
    try {
        const { id } = req.params;
        const { brand, model, year, price, color, mileage, status, condition, description } = req.body;
        
        const vehicle = await db.Vehiculo.findByPk(id);
        if (!vehicle) {
            return res.status(404).json({ error: 'Vehículo no encontrado' });
        }

        const updateData = {
            brand, model, year, price, color, mileage, status, condition, description
        };

        if (req.file) {
            updateData.image = `/uploads/${req.file.filename}`;
        }

        await vehicle.update(updateData);
        res.status(200).json(vehicle);
    } catch (error) {
        console.error('Error al actualizar vehículo:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

router.delete('/:id', verifyJWT, isAdmin, vehicleController.deleteVehicle);

module.exports = router;
