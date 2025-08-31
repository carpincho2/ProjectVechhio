const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { verifyJWT, isAdmin } = require('../middlewares/authmiddleware');
const vehicleController = require('../controllers/vehiclescontrol');

// Configuración de Multer para guardar las imágenes
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Directorio donde se guardarán las imágenes
    },
    filename: function (req, file, cb) {
        // Genera un nombre de archivo único con la fecha actual y la extensión original
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// --- Rutas de Vehículos --- //

// Obtener todos los vehículos (Ruta Pública)
router.get('/', vehicleController.getAllVehicles);

// Obtener un vehículo por su ID (Ruta Privada - Admin)
router.get('/:id', verifyJWT, isAdmin, vehicleController.getVehicleById);

// Crear un nuevo vehículo (Ruta Privada - Admin)
// upload.single('image') procesa un único archivo que venga en el campo 'image' del formulario
router.post('/', verifyJWT, isAdmin, upload.single('image'), vehicleController.createVehicle);

// Actualizar un vehículo existente (Ruta Privada - Admin)
router.put('/:id', verifyJWT, isAdmin, upload.single('image'), vehicleController.updateVehicle);

// Eliminar un vehículo (Ruta Privada - Admin)
router.delete('/:id', verifyJWT, isAdmin, vehicleController.deleteVehicle);

module.exports = router;