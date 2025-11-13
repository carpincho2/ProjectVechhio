const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehiclescontrol.js');
const { verifyJWT, isAdmin } = require('../middlewares/authmiddleware.js');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Determinar el directorio de uploads basado en el entorno
const uploadDir = process.env.NODE_ENV === 'production' ? '/tmp' : path.join(process.cwd(), 'uploads');

console.log('📁 Configurando directorio de uploads en:', uploadDir);

// En desarrollo, crear el directorio si no existe
if (process.env.NODE_ENV !== 'production') {
    try {
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
            console.log('✅ Directorio de uploads creado exitosamente');
        }
    } catch (error) {
        console.error('❌ Error al configurar el directorio de uploads:', error);
    }
}

// Configuración de Multer para la subida de archivos
const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            // En producción usar /tmp, en desarrollo verificar/crear el directorio
            if (process.env.NODE_ENV !== 'production') {
                if (!fs.existsSync(uploadDir)) {
                    fs.mkdirSync(uploadDir, { recursive: true });
                    console.log('📁 Directorio de uploads creado durante la subida');
                }
            }
            console.log('📁 Guardando archivo en:', uploadDir);
            cb(null, uploadDir);
        },
        filename: function (req, file, cb) {
            // Generar un nombre de archivo único para evitar colisiones
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const filename = uniqueSuffix + path.extname(file.originalname);
            console.log('📄 Nombre de archivo generado:', filename);
            cb(null, filename);
        }
    });

// Filtro para validar tipos de archivo
const fileFilter = (req, file, cb) => {
    // Aceptar solo imágenes
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('El archivo debe ser una imagen'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // Límite de 5MB
    }
});

// Ruta de prueba para verificar permisos
router.get('/check-uploads', (req, res) => {
    try {
        const stats = {
            directory: uploadDir,
            exists: fs.existsSync(uploadDir),
            permissions: null,
            writable: null,
            error: null
        };

        // Verificar permisos
        try {
            const fileStats = fs.statSync(uploadDir);
            stats.permissions = fileStats.mode.toString(8);
            
            // Probar escritura
            const testFile = path.join(uploadDir, 'test.txt');
            fs.writeFileSync(testFile, 'test');
            fs.unlinkSync(testFile);
            stats.writable = true;
        } catch (error) {
            stats.error = error.message;
            stats.writable = false;
        }

        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Rutas públicas
router.get('/', vehicleController.getAllVehicles);
router.get('/:id', vehicleController.getVehicleById);

// Rutas de administrador
// Se añade upload.single('image') para procesar la subida de una imagen del campo 'image'
router.post('/', verifyJWT, isAdmin, upload.single('image'), vehicleController.createVehicle);
router.put('/:id', verifyJWT, isAdmin, upload.single('image'), vehicleController.updateVehicle);
router.delete('/:id', verifyJWT, isAdmin, vehicleController.deleteVehicle);

module.exports = router;
