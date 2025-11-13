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
            host: 'smtp.gmail.com',
            port: 587,
            secure: false, // true para 465, false para otros puertos
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_APP_PASSWORD // Contraseña de aplicación de Gmail
            },
            tls: {
                rejectUnauthorized: false
            },
            connectionTimeout: 10000, // 10 segundos
            greetingTimeout: 10000, // 10 segundos
            socketTimeout: 10000, // 10 segundos
            // Reintentar en caso de error
            pool: true,
            maxConnections: 1,
            maxMessages: 3
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

        // Enviar con timeout personalizado
        const info = await Promise.race([
            gmailTransporter.sendMail(mailOptions),
            new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Timeout: El envío tardó más de 30 segundos')), 30000)
            )
        ]);

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
        console.error('Detalles del error:', error);
        
        // Mensajes de error más descriptivos
        let errorMessage = error.message || 'Error al enviar el correo';
        
        if (error.message.includes('timeout') || error.message.includes('Timeout')) {
            errorMessage = 'Timeout de conexión. Verifica tu conexión a internet y la configuración de Gmail.';
        } else if (error.message.includes('Invalid login') || error.message.includes('authentication')) {
            errorMessage = 'Error de autenticación. Verifica GMAIL_USER y GMAIL_APP_PASSWORD en tu archivo .env';
        } else if (error.message.includes('ECONNREFUSED') || error.message.includes('ENOTFOUND')) {
            errorMessage = 'No se pudo conectar al servidor de Gmail. Verifica tu conexión a internet.';
        }
        
        return { 
            success: false, 
            error: errorMessage
        };
    }
};

module.exports = sendEmail;