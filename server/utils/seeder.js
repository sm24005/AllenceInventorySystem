const User = require('../models/User');
const bcrypt = require('bcryptjs');

const seedUsers = async () => {
    try {
        // 1. Verificar si ya existen usuarios (si hay, no hacemos nada)
        const count = await User.countDocuments();
        if (count > 0) return;

        console.log('🌱 Seeding database with default users...');

        // 2. Encriptar la contraseña genérica para todos
        const salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash('123456', salt); // Contraseña: 123456

        // 3. Definir los 3 usuarios base con sus roles
        const users = [
            {
                firstName: 'System',
                lastName: 'Administrator',
                email: 'admin@allence.com',
                password: password,
                role: 'ADMIN',
                status: 'active'
            },
            {
                firstName: 'Store',
                lastName: 'Manager',
                email: 'manager@allence.com',
                password: password,
                role: 'MANAGER',
                status: 'active'
            },
            {
                firstName: 'Sales',
                lastName: 'Person',
                email: 'seller@allence.com',
                password: password,
                role: 'SELLER',
                status: 'active'
            }
        ];

        // 4. Insertarlos en la base de datos
        await User.insertMany(users);
        console.log('Default users created successfully!');
        console.log('Password for all: 123456');

    } catch (error) {
        console.error('Error seeding users:', error);
    }
};

module.exports = seedUsers;