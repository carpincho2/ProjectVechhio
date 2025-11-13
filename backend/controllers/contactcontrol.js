const sendEmail = require('../config/mailer');

// POST /api/contact
exports.sendContactMessage = async (req, res) => {
    const { nombre, email, mensaje } = req.body;
    if (!nombre || !email || !mensaje) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
    }
    try {
        const subject = `Nuevo mensaje de contacto de ${nombre}`;
        const html = `<p>Hola, soy ${email} y te quiero decir: ${mensaje}</p>`;
        // Enviar a carpincho.daniel.pane@gmail.com (email verificado en ElasticEmail)
        await sendEmail('carpincho.daniel.pane@gmail.com', subject, html);
        res.json({ success: true, message: 'Mensaje enviado correctamente.' });
    } catch (error) {
        res.status(500).json({ error: 'No se pudo enviar el mensaje.' });
    }
};
