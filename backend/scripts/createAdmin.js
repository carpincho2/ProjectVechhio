const bcrypt = require('bcrypt');
const db = require('../models'); // Importa la instancia de la base de datos

async function createAdminUser() {
    const username = 'admincarpi'; // CAMBIA ESTO
    const email = 'carpincho.admin@ejemplo.com'; // CAMBIA ESTO
    const password = '280208'; // CAMBIA ESTO A UNA CONTRASEÑA SEGURA

    try {
        // Sincronizar modelos (asegurarse de que la tabla User exista)
        await db.sequelize.sync({ force: false }); 
        console.log('✅ Base de datos sincronizada.');

        // Verificar si el usuario admin ya existe
        const existingAdmin = await db.User.findOne({ where: { username: username } });

        if (existingAdmin) {
            console.log(`[!] El usuario admin '${username}' ya existe.`);
            return;
        }

        // Hashear la contraseña
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Crear el usuario admin
        const newAdmin = await db.User.create({
            username: username,
            email: email,
            password: hashedPassword,
            role: 'admin'
        });

        console.log(`✅ Usuario admin '${newAdmin.username}' creado exitosamente.`);
    } catch (error) {
        console.error('❌ Error al crear el usuario admin:', error);
    } finally {
        // Cerrar la conexión a la base de datos
        await db.sequelize.close();
        console.log('🔌 Conexión a la base de datos cerrada.');
    }
}

createAdminUser();
