const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // true for 465
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false,
        minVersion: 'TLSv1.2'
    },
    debug: true,
    pool: true,
    maxConnections: 3,
    maxMessages: 10,
    rateDelta: 30000,
    rateLimit: 3,
    timeout: 30000
});

// Verificar la conexión al iniciar con reintentos
const verifyConnection = async (retries = 3) => {
    for (let i = 0; i < retries; i++) {
        try {
            await new Promise((resolve, reject) => {
                transporter.verify((error, success) => {
                    if (error) {
                        console.error(`Intento ${i + 1}/${retries} - Error al verificar el mailer:`, error);
                        reject(error);
                    } else {
                        console.log('Servidor de correo listo para enviar mensajes');
                        resolve(success);
                    }
                });
            });
            return true; // Si llegamos aquí, la verificación fue exitosa
        } catch (error) {
            if (i === retries - 1) {
                console.error('Todos los intentos de conexión al mailer fallaron');
                return false;
            }
            // Esperar 5 segundos antes del siguiente intento
            await new Promise(resolve => setTimeout(resolve, 5000));
        }
    }
};

// Iniciar verificación
verifyConnection();

const sendEmail = async (to, subject, html) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        html
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.info('Email sent:', info.response);
        return { success: true, info };
    } catch (error) {
        console.error('Mailer error:', error);
        // No dejar que el error del mailer detenga la aplicación
        return { success: false, error: error.message };
    }
};

module.exports = sendEmail;