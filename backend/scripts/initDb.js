require('dotenv').config();
const db = require('../models');
const bcrypt = require('bcryptjs');

async function initDb() {
    try {
        console.log('🔍 Iniciando BD...');
        
        // Autenticar
        await db.sequelize.authenticate();
        console.log('✅ Conectado a BD');

        // Force sync (borra y recrea todas las tablas)
        await db.sequelize.sync({ force: true });
        console.log('✅ Tablas creadas');

        // Crear superadmin
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(process.env.ADMIN_PASSWORD || '280208', salt);
        
        await db.User.create({
            username: process.env.ADMIN_USERNAME || 'admincarpi',
            email: process.env.ADMIN_EMAIL || 'carpijefe@gmail.com',
            password: hashed,
            role: 'superadmin'
        });
        
        console.log('✅ Superadmin creado');
        console.log('🎉 Base de datos inicializada correctamente');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

initDb();
