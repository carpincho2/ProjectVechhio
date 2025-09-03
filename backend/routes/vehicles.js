const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehiclescontrol.js');
const { verifyJWT, isAdmin } = require('../middlewares/authmiddleware.js');
const multer = require('multer');
const path = require('path');

// Configuración de Multer para la subida de archivos
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Directorio donde se guardarán las imágenes
    },
    filename: function (req, file, cb) {
        // Generar un nombre de archivo único para evitar colisiones
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Rutas públicas
router.get('/', vehicleController.getAllVehicles);
router.get('/:id', vehicleController.getVehicleById);

// Rutas de administrador
// Se añade upload.single('image') para procesar la subida de una imagen del campo 'image'
router.post('/', verifyJWT, isAdmin, upload.single('image'), vehicleController.createVehicle);
router.put('/:id', verifyJWT, isAdmin, vehicleController.updateVehicle);
router.delete('/:id', verifyJWT, isAdmin, vehicleController.deleteVehicle);

module.exports = router;
