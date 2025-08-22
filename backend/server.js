require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');

// Importar el objeto 'db' centralizado desde models/index.js
const db = require('./models');

// Importar rutas
const authRoutes = require('./routes/auth');
const financeRoutes = require('./routes/finances'); // Descomentar cuando se implementen
const serviceRoutes = require('./routes/service');   // Descomentar cuando se implementen
const vehicleRoutes = require('./routes/vehicles'); // Descomentar cuando se implementen

const app = express();
const PORT = process.env.PORT || 3000;

// --- Middlewares ---
// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// Parsear JSON y datos de formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de la sesión
app.use(session({
    secret: process.env.SESSION_SECRET || 'consecionaria-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // 'secure: true' en producción con HTTPS
}));

// Middleware de debug para sessions (opcional, útil para desarrollo)
app.use((req, res, next) => {
  // console.log('Session ID:', req.sessionID);
  // console.log('Session data:', req.session);
  next();
});


// --- Rutas de la API ---
app.use('/api/auth', authRoutes);
app.use('/api/finances', financeRoutes); // Descomentar cuando se implementen
app.use('/api/services', serviceRoutes);   // Descomentar cuando se implementen
app.use('/api/vehicles', vehicleRoutes); // Descomentar cuando se implementen

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

        await db.sequelize.sync({ force: false }); // force: true resetea la DB
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