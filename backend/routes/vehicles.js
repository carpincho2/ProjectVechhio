const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const db = require('../models'); // Importa la instancia de la base de datos
const { isAdmin } = require('../middlewares/authmiddleware'); // Importa el middleware isAdmin

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
router.get('/', async (req, res) => {
    try {
        const vehicles = await db.Vehiculo.findAll();
        res.status(200).json(vehicles);
    } catch (error) {
        console.error('Error al obtener vehículos:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Ruta para crear un nuevo vehículo (solo admin)
router.post('/', isAdmin, upload.single('image'), async (req, res) => {
    try {
        const { brand, model, year, price, color, mileage, status, condition } = req.body;
        const image = req.file ? `/uploads/${req.file.filename}` : null;
        const newVehicle = await db.Vehiculo.create({ brand, model, year, price, color, mileage, status, condition, image });
        res.status(201).json(newVehicle);
    } catch (error) {
        console.error('Error al crear vehículo:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Rutas placeholder para PUT y DELETE (solo admin)
router.put('/:id', isAdmin, (req, res) => {
    res.status(501).json({ message: 'Actualizar vehículo no implementado aún.' });
});

router.delete('/:id', isAdmin, (req, res) => {
    res.status(501).json({ message: 'Eliminar vehículo no implementado aún.' });
});

module.exports = router;
