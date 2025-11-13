const { Resend } = require('resend');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Crear instancia de Resend con la API key (si está disponible)
let resend = null;
if (process.env.RESEND_API_KEY) {
    resend = new Resend(process.env.RESEND_API_KEY);
}

// Verificar qué método de envío está disponible
const getEmailMethod = () => {
    // Prioridad 1: Gmail SMTP (GRATIS) - Siempre se prioriza Gmail
    if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
        return 'gmail';
    }
    // Prioridad 2: Resend (solo si Gmail no está configurado)
    if (process.env.RESEND_API_KEY && process.env.EMAIL_FROM) {
        return 'resend';
    }
    return null;
};

// Crear transporter de Gmail si está configurado
let gmailTransporter = null;
if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
    gmailTransporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_APP_PASSWORD // Contraseña de aplicación de Gmail
        }
    });
    console.log('✅ Gmail SMTP configurado correctamente');
}

// Verificar configuración
const verifyConfiguration = () => {
    const method = getEmailMethod();
    if (!method) {
        console.error('⚠️ No hay método de email configurado. Configura GMAIL_USER + GMAIL_APP_PASSWORD (recomendado) o RESEND_API_KEY');
        return false;
    }
    return true;
};

// Iniciar verificación al cargar el módulo
verifyConfiguration();

const sendEmail = async (to, subject, html) => {
    if (!verifyConfiguration()) {
        return { success: false, error: 'No hay método de email configurado' };
    }

    const method = getEmailMethod();
    const isTestMode = process.env.NODE_ENV !== 'production';
    const testEmail = process.env.NODE_ENV === 'production' ? to : (process.env.TEST_EMAIL || 'carpijefe@gmail.com');

    // Agregar nota si está en modo de prueba
    const testingNote = isTestMode ? `
    <div style="background-color: #f8f9fa; padding: 10px; margin-bottom: 20px; border-radius: 5px;">
        <p style="margin: 0; font-size: 12px;"><strong>Nota de prueba:</strong> Email destinado a: ${to}</p>
    </div>` : '';

    try {
        if (method === 'resend') {
            // Usar Resend
            const response = await resend.emails.send({
                from: process.env.EMAIL_FROM,
                to: testEmail,
                subject: isTestMode ? `[PRUEBA] ${subject}` : subject,
                html: testingNote + html,
                headers: {
                    'X-Entity-Ref-ID': new Date().getTime().toString()
                }
            });

            if (!response || !response.data) {
                throw new Error('Respuesta inválida de Resend');
            }

            return { 
                success: true, 
                info: {
                    id: response.data.id,
                    to: to,
                    method: 'resend',
                    timestamp: new Date().toISOString()
                }
            };
        } else if (method === 'gmail') {
            // Usar Gmail SMTP (GRATIS)
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
        }
    } catch (error) {
        console.error('Error al enviar email:', error.message);
        return { 
            success: false, 
            error: error.message || 'Error al enviar el correo'
        };
    }
};

module.exports = sendEmail;