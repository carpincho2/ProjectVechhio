const sendEmail = require('../config/mailer');

// POST /api/contact
exports.sendContactMessage = async (req, res) => {
    const { nombre, email, mensaje } = req.body;
    if (!nombre || !email || !mensaje) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
    }
    try {
        const subject = `Nuevo mensaje de contacto de ${nombre}`;
        const html = `<h3>Mensaje de contacto</h3><p><b>Nombre:</b> ${nombre}</p><p><b>Email:</b> ${email}</p><p><b>Mensaje:</b><br>${mensaje}</p>`;
        // Cambia el correo de destino por el tuyo
        await sendEmail('tucorreo@dominio.com', subject, html);
        res.json({ success: true, message: 'Mensaje enviado correctamente.' });
    } catch (error) {
        res.status(500).json({ error: 'No se pudo enviar el mensaje.' });
    }
};
