const nodemailer = require('nodemailer');
const config = require('../config/config');
const { logger } = require('../utils');

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || config.email.host,
            port: process.env.SMTP_PORT || config.email.port,
            secure: process.env.NODE_ENV === 'production',
            auth: {
                user: process.env.SMTP_USER || config.email.user,
                pass: process.env.SMTP_PASS || config.email.pass
            }
        });
    }

    async sendEmail(options) {
        try {
            const mailOptions = {
                from: process.env.SMTP_FROM || config.email.from,
                to: options.to,
                subject: options.subject,
                html: options.html
            };

            const info = await this.transporter.sendMail(mailOptions);
            logger.info('Email enviado:', info.messageId);
            return info;
        } catch (error) {
            logger.error('Error al enviar email:', error);
            throw new Error('Error al enviar email');
        }
    }

    // Plantillas de email
    async sendWelcomeEmail(user) {
        const html = `
            <h1>¡Bienvenido a ProjectVechhio!</h1>
            <p>Hola ${user.username},</p>
            <p>Gracias por registrarte en nuestra plataforma.</p>
            <p>Puedes comenzar a explorar nuestros servicios iniciando sesión.</p>
        `;

        return this.sendEmail({
            to: user.email,
            subject: '¡Bienvenido a ProjectVechhio!',
            html
        });
    }

    async sendPasswordReset(user, token) {
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
        const html = `
            <h1>Restablecimiento de Contraseña</h1>
            <p>Hola ${user.username},</p>
            <p>Has solicitado restablecer tu contraseña.</p>
            <p>Haz clic en el siguiente enlace para continuar:</p>
            <a href="${resetUrl}">Restablecer Contraseña</a>
            <p>Si no solicitaste esto, ignora este correo.</p>
        `;

        return this.sendEmail({
            to: user.email,
            subject: 'Restablecimiento de Contraseña',
            html
        });
    }

    async sendFinanceConfirmation(user, finance) {
        const html = `
            <h1>Solicitud de Financiación Recibida</h1>
            <p>Hola ${user.username},</p>
            <p>Hemos recibido tu solicitud de financiación:</p>
            <ul>
                <li>Monto: $${finance.amount}</li>
                <li>Plazo: ${finance.months} meses</li>
                <li>Vehículo: ${finance.vehicle.brand} ${finance.vehicle.model}</li>
            </ul>
            <p>Te contactaremos pronto con una respuesta.</p>
        `;

        return this.sendEmail({
            to: user.email,
            subject: 'Solicitud de Financiación Recibida',
            html
        });
    }

    async sendServiceConfirmation(user, service) {
        const html = `
            <h1>Turno de Servicio Confirmado</h1>
            <p>Hola ${user.username},</p>
            <p>Tu turno ha sido confirmado:</p>
            <ul>
                <li>Fecha: ${new Date(service.date).toLocaleDateString()}</li>
                <li>Tipo: ${service.serviceType}</li>
                <li>Vehículo: ${service.vehicle.brand} ${service.vehicle.model}</li>
            </ul>
            <p>Te esperamos en nuestro taller.</p>
        `;

        return this.sendEmail({
            to: user.email,
            subject: 'Turno de Servicio Confirmado',
            html
        });
    }
}

module.exports = new EmailService();