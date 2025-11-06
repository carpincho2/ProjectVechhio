const { Resend } = require('resend');
require('dotenv').config();

// Crear instancia de Resend con la API key
const resend = new Resend(process.env.RESEND_API_KEY);

// Verificar que tenemos la API key configurada
const verifyConfiguration = () => {
    if (!process.env.RESEND_API_KEY) {
        console.error('⚠️ RESEND_API_KEY no está configurada en las variables de entorno');
        return false;
    }
    if (!process.env.EMAIL_FROM) {
        console.error('⚠️ EMAIL_FROM no está configurada en las variables de entorno');
        return false;
    }
    console.log('✅ Configuración de Resend cargada correctamente');
    return true;
};

// Iniciar verificación
verifyConfiguration();

const sendEmail = async (to, subject, html) => {
    if (!verifyConfiguration()) {
        return { success: false, error: 'Resend no está configurado correctamente' };
    }

    try {
        const response = await resend.emails.send({
            from: process.env.EMAIL_FROM,
            to,
            subject,
            html
        });

        console.info('Email sent successfully:', response.id);
        return { success: true, info: response };
    } catch (error) {
        console.error('Resend error:', error);
        return { 
            success: false, 
            error: error.message || 'Error al enviar el correo'
        };
    }
};

module.exports = sendEmail;