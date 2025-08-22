require('dotenv').config();
const express = require('express');
const path = require('path');
const { Sequelize } = require('sequelize');
const { Op } = require('sequelize');

// Importar rutas
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de la base de datos
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, '../database/consecionaria.db'),
    logging: false
});

// ✅ LÍNEA CRUCIAL AGREGADA - Para formularios HTML
app.use(express.urlencoded({ extended: true }));

// Middleware básico
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));
const session = require('express-session');

// ✅ ESTO DEBE ESTAR DESPUÉS de app.use(express.json()) y ANTES de las rutas
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: process.env.SESSION_SECRET || 'consecionaria-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 }
}));
// Middleware de debug para sessions
app.use((req, res, next) => {
  console.log('Session ID:', req.sessionID);
  console.log('Session data:', req.session);
  next();
});
app.use(express.static(path.join(__dirname, '../frontend')));

// ✅ SOLO DESPUÉS de session van las rutas
app.use('/api/auth', authRoutes);
// Usar rutas
app.use('/api/auth', authRoutes);

// Rutas simples de prueba
app.get('/api/status', (req, res) => {
    res.json({ status: 'OK', message: 'Servidor funcionando', timestamp: new Date() });
});

// Función principal async
async function startServer() {
    try {
        await sequelize.authenticate();
        console.log('✅ Base de datos conectada');
        
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
        });
        
    } catch (error) {
        console.error('❌ Error al iniciar:', error.message);
        process.exit(1);
    }
}

startServer().catch(console.error);