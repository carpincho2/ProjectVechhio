const { Resend } = require('resend');
require('dotenv').config();

// Crear instancia de Resend con la API key
´const resend = new Resend(process.env.RESEND_API_KEY);

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
        // En modo de prueba, redirigir todos los emails a la dirección verificada
        const testEmail = 'carpijefe@gmail.com';
        const originalTo = to;

        // Log de los datos que se están enviando
        console.log('Enviando email con los siguientes datos:');
        console.log('From:', process.env.EMAIL_FROM);
        console.log('Email original:', originalTo);
        console.log('Redirigido a:', testEmail);
        console.log('Subject:', subject);

        // Agregar nota sobre el email original
        const testingNote = `
        <div style="background-color: #f8f9fa; padding: 10px; margin-bottom: 20px; border-radius: 5px;">
            <p style="margin: 0;"><strong>Nota de prueba:</strong> Este email estaba destinado originalmente a: ${originalTo}</p>
        </div>`;

        const response = await resend.emails.send({
            from: process.env.EMAIL_FROM,
            to: testEmail,
            subject: `[PRUEBA] ${subject}`,
            html: testingNote + html,
            // Agregamos cabeceras para tracking
            headers: {
                'X-Entity-Ref-ID': new Date().getTime().toString()
            }
        });

        // Log completo de la respuesta
        console.log('Respuesta completa de Resend:', JSON.stringify(response, null, 2));

        if (!response || !response.data) {
            throw new Error('Respuesta inválida de Resend');
        }

        const emailId = response.data ? response.data.id : 'ID no disponible';
        console.info('Email enviado exitosamente. ID:', emailId);
        
        return { 
            success: true, 
            info: {
                id: emailId,
                to: to,
                timestamp: new Date().toISOString()
            }
        };
    } catch (error) {
        console.error('Error detallado al enviar email:', {
            message: error.message,
            stack: error.stack,
            details: error.response ? error.response.data : null
        });
        
        return { 
            success: false, 
            error: error.message || 'Error al enviar el correo',
            details: error.response ? error.response.data : null
        };
    }
};

module.exports = sendEmail;