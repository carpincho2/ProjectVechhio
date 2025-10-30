require('dotenv').config();
const express = require('express');
const path = require('path');

// Importar el objeto 'db' centralizado desde models/index.js
const db = require('./models');

// Importar rutas
const authRoutes = require('./routes/auth');
const financeRoutes = require('./routes/finances'); // Descomentar cuando se implementen
const serviceRoutes = require('./routes/service');   // Descomentar cuando se implementen
const vehicleRoutes = require('./routes/vehicles'); // Descomentar cuando se implementen
const profileRoutes = require('./routes/profile');
const userRoutes = require('./routes/users');
const statisticsRoutes = require('./routes/statistics');
const contactRoutes = require('./routes/contact');

const app = express();
// Si la app se ejecuta detrás de un proxy (Render, Heroku, etc.),
// habilitamos trust proxy para que Express conozca el protocolo original (https)
app.set('trust proxy', 1);
const PORT = process.env.PORT || 3000;

// Configuración de Passport
const passport = require('passport');
require('./config/passport')(passport);

// --- Middlewares ---
// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// Servir archivos estáticos de la carpeta de subidas
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Parsear JSON y datos de formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de Sesión para Passport
const session = require('express-session');
// Ajuste de cookies para producción: si estamos en producción (HTTPS detrás de proxy)
// marcamos la cookie como secure para que solo se transmita por HTTPS.
// También setea sameSite='lax' que funciona bien con OAuth flows.
app.use(session({
    secret: process.env.SESSION_SECRET || 'tu_secreto_de_sesion',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: (process.env.NODE_ENV === 'production'),
        sameSite: 'lax'
    }
}));

// Inicialización de Passport
app.use(passport.initialize());
app.use(passport.session());

// Middleware de debug para sessions (opcional, útil para desarrollo)
app.use((req, res, next) => {
  // console.log('Session ID:', req.sessionID);
  // console.log('Session data:', req.session);
  next();
});


// --- Rutas de la API ---
app.use('/api/auth', authRoutes);
app.use('/api/finances', financeRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/users', userRoutes);
app.use('/api/statistics', statisticsRoutes);
app.use('/api/contact', contactRoutes);

// Endpoint temporal para crear un superadmin
// Ajuste: Hashear la contraseña antes de guardar el superadmin
const bcrypt = require('bcryptjs');

app.get('/api/admin/create', async (req, res) => {
    const secret = req.query.secret;
    if (secret !== process.env.ADMIN_CREATION_SECRET) {
        console.log('ADMIN_CREATION_SECRET:', process.env.ADMIN_CREATION_SECRET); // Log para depuración
        return res.status(403).json({ message: 'Unauthorized' });
    }

    const adminData = {
        username: process.env.ADMIN_USERNAME || 'admincarpi',
        email: process.env.ADMIN_EMAIL || 'carpijefe@gmail.com',
        password: process.env.ADMIN_PASSWORD || '280208',
    };

    try {
        const existingAdmin = await db.User.findOne({ where: { email: adminData.email } });
        if (existingAdmin) {
            return res.status(400).json({ message: 'Admin already exists' });
        }

        // Hashear la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(adminData.password, salt);
        adminData.password = hashedPassword;

        const newAdmin = await db.User.create(adminData);
        res.status(201).json({ message: 'Superadmin created', admin: newAdmin });
    } catch (error) {
        res.status(500).json({ message: 'Error creating superadmin', error });
    }
});

app.get('/panel-control', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/panel-control.html'));
});

// Ruta simple de estado
app.get('/api/status', (req, res) => {
    res.json({ status: 'OK', message: 'Servidor funcionando', timestamp: new Date() });
});


// --- Inicio del Servidor ---
async function startServer() {
    try {
        // Autenticar la conexión
        await db.sequelize.authenticate();
        console.log('✅ Base de datos conectada y autenticada.');

        // Sincronizar modelos antes de operar sobre las tablas
        await db.sequelize.sync(); // Forzar actualización del esquema
        console.log('✅ Modelos sincronizados con la base de datos.');

        // Intentar truncar la tabla de backup solo si existe (evitar crash si no existe)
        if (db.UserBackup) {
            try {
                await db.UserBackup.destroy({ truncate: true });
                console.log('✅ Tabla users_backup truncada.');
            } catch (err) {
                console.warn('⚠️ No se pudo truncar users_backup (probablemente no existe aún). Se continúa con el inicio.');
            }
        }

        // Crear un usuario admin demo si no existe (útil para el profe)
        try {
            const adminExists = await db.User.findOne({ where: { role: 'superadmin' } });
            if (!adminExists) {
                const bcrypt = require('bcryptjs');
                const salt = await bcrypt.genSalt(10);
                const hashed = await bcrypt.hash(process.env.ADMIN_PASSWORD || '280208', salt);
                await db.User.create({
                    username: process.env.ADMIN_USERNAME || 'admincarpi',
                    email: process.env.ADMIN_EMAIL || 'carpijefe@gmail.com',
                    password: hashed,
                    role: 'superadmin'
                });
                console.log('✅ Usuario admin demo creado.');
            }
        } catch (err) {
            console.warn('⚠️ No se pudo crear el admin demo:', err.message || err);
        }

        app.listen(PORT, '0.0.0.0', () => {
            console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
        });
        
    } catch (error) {
        console.error('❌ Error al iniciar el servidor:', error);
        process.exit(1);
    }
}

startServer();