require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const bcrypt = require('bcryptjs');

// Importar base de datos y rutas
const db = require('./models');
require('./config/passport')(passport);

const authRoutes = require('./routes/auth');
const financeRoutes = require('./routes/finances');
const serviceRoutes = require('./routes/service');
const vehicleRoutes = require('./routes/vehicles');
const profileRoutes = require('./routes/profile');
const userRoutes = require('./routes/users');
const statisticsRoutes = require('./routes/statistics');
const contactRoutes = require('./routes/contact');

const app = express();
app.set('trust proxy', 1);
const PORT = process.env.PORT || 10000;

// --- Middlewares ---
// CORS
app.use(cors({
    origin: [
        'http://localhost:5500', 
        'http://127.0.0.1:5500',
        'https://projectvechhio.onrender.com'
    ],
    credentials: true
}));

// Archivos estáticos
app.use(express.static(path.join(__dirname, '../frontend')));
app.use('/uploads', express.static(process.env.NODE_ENV === 'production' ? '/tmp' : path.join(__dirname, 'uploads')));

// Parsear JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sesiones
app.use(session({
    secret: process.env.SESSION_SECRET || 'tu_secreto_de_sesion',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: (process.env.NODE_ENV === 'production'),
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000
    }
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());

// --- Rutas ---
app.use('/api/auth', authRoutes);
app.use('/api/finances', financeRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/users', userRoutes);
app.use('/api/statistics', statisticsRoutes);
app.use('/api/contact', contactRoutes);

// Endpoint para crear superadmin (protegido con secret)
app.get('/api/admin/create', async (req, res) => {
    const secret = req.query.secret;
    if (secret !== process.env.ADMIN_CREATION_SECRET) {
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

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(adminData.password, salt);
        adminData.password = hashedPassword;
        adminData.role = 'superadmin';

        const newAdmin = await db.User.create(adminData);
        res.status(201).json({ message: 'Superadmin created', admin: { id: newAdmin.id, username: newAdmin.username } });
    } catch (error) {
        res.status(500).json({ message: 'Error creating superadmin', error: error.message });
    }
});

// Ruta para panel-control
app.get('/panel-control', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/panel-control.html'));
});

// Endpoint de estado
app.get('/api/status', (req, res) => {
    res.json({ status: 'OK', message: 'Servidor funcionando', timestamp: new Date() });
});

// --- Inicio del Servidor ---
async function startServer() {
    try {
        console.log('🔍 Iniciando servidor...');
        console.log('DATABASE_URL configurado:', !!process.env.DATABASE_URL);
        
        // Autenticar con la base de datos
        await db.sequelize.authenticate();
        console.log('✅ Base de datos conectada.');

        // Sincronizar modelos
        await db.sequelize.sync();
        console.log('✅ Modelos sincronizados.');

        // Limpiar tabla de backup si existe
        if (db.UserBackup) {
            try {
                await db.UserBackup.destroy({ truncate: true });
                console.log('✅ Tabla users_backup truncada.');
            } catch (err) {
                // Tabla no existe aún, no hay problema
            }
        }

        // Crear superadmin demo si no existe
        try {
            const adminExists = await db.User.findOne({ where: { role: 'superadmin' } });
            if (!adminExists) {
                const salt = await bcrypt.genSalt(10);
                const hashed = await bcrypt.hash(process.env.ADMIN_PASSWORD || '280208', salt);
                await db.User.create({
                    username: process.env.ADMIN_USERNAME || 'admincarpi',
                    email: process.env.ADMIN_EMAIL || 'carpijefe@gmail.com',
                    password: hashed,
                    role: 'superadmin'
                });
                console.log('✅ Superadmin demo creado.');
            }
        } catch (err) {
            console.warn('⚠️ No se pudo crear el admin demo:', err.message);
        }

        app.listen(PORT, '0.0.0.0', () => {
            console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
        });
        
    } catch (error) {
        console.error('❌ Error al iniciar:', error.message);
        console.error('Stack completo:', error.stack);
        process.exit(1);
    }
}

startServer();