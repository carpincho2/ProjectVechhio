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
app.use(session({
    secret: process.env.SESSION_SECRET || 'tu_secreto_de_sesion',
    resave: false,
    saveUninitialized: false
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
        // Autenticar y sincronizar la base de datos usando la instancia de Sequelize de 'db'
        await db.sequelize.authenticate();
        console.log('✅ Base de datos conectada y autenticada.');

        if (db.UserBackup) {
            await db.UserBackup.destroy({ truncate: true });
        }

        await db.sequelize.sync(); // Forzar actualización del esquema
        console.log('✅ Modelos sincronizados con la base de datos.');
        
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
        });
        
    } catch (error) {
        console.error('❌ Error al iniciar el servidor:', error);
        process.exit(1);
    }
}

startServer();