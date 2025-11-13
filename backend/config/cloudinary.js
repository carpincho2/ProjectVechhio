const axios = require('axios');
const FormData = require('form-data');
require('dotenv').config();

// Verificar qué servicio de imágenes está configurado
const hasCloudinary = process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET;
const hasImgBB = process.env.IMGBB_API_KEY;

if (hasCloudinary) {
    const cloudinary = require('cloudinary').v2;
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });
    console.log('✅ Cloudinary configurado correctamente');
} else if (hasImgBB) {
    console.log('✅ ImgBB configurado correctamente (alternativa a Cloudinary)');
} else {
    console.log('⚠️ No hay servicio de imágenes configurado. Las imágenes se guardarán localmente.');
}

// Función para subir imagen a Cloudinary
const uploadToCloudinary = async (filePath) => {
    if (!process.env.CLOUDINARY_CLOUD_NAME) {
        return null; // Si no está configurado, retornar null para usar almacenamiento local
    }

    try {
        const cloudinary = require('cloudinary').v2;
        const result = await cloudinary.uploader.upload(filePath, {
            folder: 'vehicles', // Carpeta en Cloudinary
            resource_type: 'auto',
            transformation: [
                { width: 800, height: 600, crop: 'limit' }, // Redimensionar si es muy grande
                { quality: 'auto' } // Optimizar calidad automáticamente
            ]
        });
        return result.secure_url; // Retornar la URL segura de la imagen
    } catch (error) {
        console.error('Error al subir imagen a Cloudinary:', error);
        return null;
    }
};

// Función para subir desde buffer (para Multer)
const uploadFromBuffer = async (buffer, filename) => {
    // Prioridad 1: ImgBB (más simple, no requiere tarjeta)
    if (process.env.IMGBB_API_KEY) {
        try {
            const formData = new FormData();
            formData.append('key', process.env.IMGBB_API_KEY);
            formData.append('image', buffer, { filename: filename || 'image.jpg' });

            const response = await axios.post('https://api.imgbb.com/1/upload', formData, {
                headers: formData.getHeaders(),
                timeout: 30000
            });

            if (response.data && response.data.success) {
                console.log('Imagen subida a ImgBB:', response.data.data.url);
                return response.data.data.url;
            } else {
                throw new Error('Error en respuesta de ImgBB');
            }
        } catch (error) {
            console.error('Error al subir a ImgBB:', error.message);
            // Si falla ImgBB, intentar Cloudinary como fallback
            if (process.env.CLOUDINARY_CLOUD_NAME) {
                return uploadToCloudinaryFromBuffer(buffer);
            }
            return null;
        }
    }

    // Prioridad 2: Cloudinary
    if (process.env.CLOUDINARY_CLOUD_NAME) {
        return uploadToCloudinaryFromBuffer(buffer);
    }

    return null;
};

// Función auxiliar para Cloudinary desde buffer
const uploadToCloudinaryFromBuffer = async (buffer) => {
    if (!process.env.CLOUDINARY_CLOUD_NAME) {
        return null;
    }

    const cloudinary = require('cloudinary').v2;
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: 'vehicles',
                resource_type: 'auto',
                transformation: [
                    { width: 800, height: 600, crop: 'limit' },
                    { quality: 'auto' }
                ]
            },
            (error, result) => {
                if (error) {
                    console.error('Error al subir a Cloudinary:', error);
                    reject(error);
                } else {
                    resolve(result.secure_url);
                }
            }
        );
        uploadStream.end(buffer);
    });
};

module.exports = {
    uploadToCloudinary,
    uploadFromBuffer
};

