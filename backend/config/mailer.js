const { Resend } = require('resend');
require('dotenv').config();

// Crear instancia de Resend con la API key
const resend = new Resend(process.env.RESEND_API_KEY);

// Verificar que la configuración de Resend está correcta
const verifyConfiguration = () => {
    if (!process.env.RESEND_API_KEY) {
        console.error('⚠️ RESEND_API_KEY no está configurada');
        return false;
    }
    if (!process.env.EMAIL_FROM) {
        console.error('⚠️ EMAIL_FROM no está configurada');
        return false;
    }
    return true;
};

// Iniciar verificación al cargar el módulo
verifyConfiguration();

const sendEmail = async (to, subject, html) => {
    if (!verifyConfiguration()) {
        return { success: false, error: 'Resend no está configurado correctamente' };
    }

    try {
        // En desarrollo, redirigir emails a dirección verificada
        const testEmail = process.env.NODE_ENV === 'production' ? to : 'carpijefe@gmail.com';
        const isTestMode = process.env.NODE_ENV !== 'production';

        // Agregar nota si está en modo de prueba
        const testingNote = isTestMode ? `
        <div style="background-color: #f8f9fa; padding: 10px; margin-bottom: 20px; border-radius: 5px;">
            <p style="margin: 0; font-size: 12px;"><strong>Nota de prueba:</strong> Email destinado a: ${to}</p>
        </div>` : '';

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