const bcrypt = require('bcryptjs');
const db = require('../models'); // Importa la instancia de la base de datos

async function createAdminUser() {
    const username = process.env.ADMIN_USERNAME || 'admincarpi'; // Considerar usar variables de entorno
    const email = process.env.ADMIN_EMAIL || 'carpijefe@gmail.com'; // Considerar usar variables de entorno
    const password = process.env.ADMIN_PASSWORD || '280208'; // CAMBIA ESTO A UNA CONTRASEÑA SEGURA y considera variables de entorno

    try {
        // Sincronizar modelos (asegurarse de que la tabla User exista)
        await db.sequelize.sync({ force: false }); 

        // Verificar si el usuario admin ya existe
        const existingAdmin = await db.User.findOne({ where: { username: username } });

        if (existingAdmin) {
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
            role: 'superadmin'
        });
    } catch (error) {
        console.error('❌ Error al crear el usuario admin:', error);
    } finally {
        // Cerrar la conexión a la base de datos
        await db.sequelize.close();
    }
}

createAdminUser();
