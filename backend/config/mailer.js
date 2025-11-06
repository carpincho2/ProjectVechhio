const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false // Permite certificados autofirmados
    },
    pool: true,
    maxConnections: 1,
    maxMessages: 3,
    rateDelta: 20000,
    rateLimit: 1,
    timeout: 15000
});

// Verificar la conexión al iniciar
transporter.verify(function(error, success) {
    if (error) {
        console.error('Error al verificar el mailer:', error);
    } else {
        console.log('Servidor de correo listo para enviar mensajes');
    }
});

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