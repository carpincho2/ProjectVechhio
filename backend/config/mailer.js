const nodemailer = require('nodemailer');
require('dotenv').config();

// Crear transporter de Gmail
let gmailTransporter = null;

// Verificar y configurar Gmail SMTP
const verifyConfiguration = () => {
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
        console.error('⚠️ Gmail SMTP no está configurado. Configura GMAIL_USER y GMAIL_APP_PASSWORD en tu archivo .env');
        return false;
    }

    // Crear transporter si no existe
    if (!gmailTransporter) {
        gmailTransporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_APP_PASSWORD // Contraseña de aplicación de Gmail
            }
        });
        console.log('✅ Gmail SMTP configurado correctamente');
    }

    return true;
};

// Iniciar verificación al cargar el módulo
verifyConfiguration();

const sendEmail = async (to, subject, html) => {
    if (!verifyConfiguration()) {
        return { success: false, error: 'Gmail SMTP no está configurado correctamente' };
    }

    const isTestMode = process.env.NODE_ENV !== 'production';
    const testEmail = process.env.NODE_ENV === 'production' ? to : (process.env.TEST_EMAIL || 'carpijefe@gmail.com');

    // Agregar nota si está en modo de prueba
    const testingNote = isTestMode ? `
    <div style="background-color: #f8f9fa; padding: 10px; margin-bottom: 20px; border-radius: 5px;">
        <p style="margin: 0; font-size: 12px;"><strong>Nota de prueba:</strong> Email destinado a: ${to}</p>
    </div>` : '';

    try {
        const fromEmail = process.env.GMAIL_USER;
        const mailOptions = {
            from: `"${process.env.EMAIL_FROM_NAME || 'ProjectVechhio'}" <${fromEmail}>`,
            to: testEmail,
            subject: isTestMode ? `[PRUEBA] ${subject}` : subject,
            html: testingNote + html
        };

        const info = await gmailTransporter.sendMail(mailOptions);

        return { 
            success: true, 
            info: {
                id: info.messageId,
                to: to,
                method: 'gmail',
                timestamp: new Date().toISOString()
            }
        };
    } catch (error) {
        console.error('Error al enviar email:', error.message);
        return { 
            success: false, 
            error: error.message || 'Error al enviar el correo'
        };
    }
};

module.exports = sendEmail;