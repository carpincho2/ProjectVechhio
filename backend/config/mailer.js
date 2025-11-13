const axios = require('axios');
require('dotenv').config();

// Verificar configuración de ElasticEmail
const verifyConfiguration = () => {
    if (!process.env.ELASTICEMAIL_API_KEY) {
        console.error('⚠️ ElasticEmail no está configurado. Configura ELASTICEMAIL_API_KEY en tu archivo .env');
        return false;
    }
    if (!process.env.ELASTICEMAIL_FROM_EMAIL) {
        console.error('⚠️ ElasticEmail FROM no está configurado. Configura ELASTICEMAIL_FROM_EMAIL en tu archivo .env');
        return false;
    }
    return true;
};

// Iniciar verificación al cargar el módulo
if (verifyConfiguration()) {
    console.log('✅ ElasticEmail configurado correctamente');
}

const sendEmail = async (to, subject, html) => {
    if (!verifyConfiguration()) {
        return { success: false, error: 'ElasticEmail no está configurado correctamente' };
    }

    const isTestMode = process.env.NODE_ENV !== 'production';
    const testEmail = process.env.NODE_ENV === 'production' ? to : (process.env.TEST_EMAIL || 'carpijefe@gmail.com');

    // Agregar nota si está en modo de prueba
    const testingNote = isTestMode ? `
    <div style="background-color: #f8f9fa; padding: 10px; margin-bottom: 20px; border-radius: 5px;">
        <p style="margin: 0; font-size: 12px;"><strong>Nota de prueba:</strong> Email destinado a: ${to}</p>
    </div>` : '';

    try {
        const fromEmail = process.env.ELASTICEMAIL_FROM_EMAIL;
        const fromName = process.env.EMAIL_FROM_NAME || 'ProjectVechhio';
        
        // ElasticEmail API endpoint
        const apiUrl = 'https://api.elasticemail.com/v2/email/send';
        
        // Parámetros para ElasticEmail API
        const params = new URLSearchParams({
            apikey: process.env.ELASTICEMAIL_API_KEY,
            from: `${fromName} <${fromEmail}>`,
            to: testEmail,
            subject: isTestMode ? `[PRUEBA] ${subject}` : subject,
            bodyHtml: testingNote + html,
            isTransactional: 'true'
        });

        // Enviar email usando ElasticEmail API
        const response = await axios.post(apiUrl, params.toString(), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            timeout: 30000 // 30 segundos timeout
        });

        if (response.data && response.data.success) {
            return { 
                success: true, 
                info: {
                    id: response.data.data?.TransactionID || 'N/A',
                    to: to,
                    method: 'elasticemail',
                    timestamp: new Date().toISOString()
                }
            };
        } else {
            throw new Error(response.data?.error || 'Error desconocido de ElasticEmail');
        }
    } catch (error) {
        console.error('Error al enviar email:', error.message);
        console.error('Detalles del error:', error.response?.data || error);
        
        // Mensajes de error más descriptivos
        let errorMessage = error.message || 'Error al enviar el correo';
        
        if (error.response?.data?.error) {
            errorMessage = `ElasticEmail: ${error.response.data.error}`;
        } else if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
            errorMessage = 'Timeout de conexión. Verifica tu conexión a internet.';
        } else if (error.response?.status === 401) {
            errorMessage = 'Error de autenticación. Verifica ELASTICEMAIL_API_KEY en tu archivo .env';
        } else if (error.response?.status === 400) {
            errorMessage = `Error de validación: ${error.response.data?.error || 'Verifica los parámetros del email'}`;
        }
        
        return { 
            success: false, 
            error: errorMessage
        };
    }
};

module.exports = sendEmail;