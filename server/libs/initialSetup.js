const User = require('../models/User');
const bcrypt = require('bcryptjs');

const createAdmin = async () => {
    try {
        const count = await User.estimatedDocumentCount();
        if (count > 0) return;

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);

        const adminUser = new User({
            firstName: 'System',
            lastName: 'Administrator',
            email: 'admin@allence.com',
            password: hashedPassword,
            role: 'ADMIN',
            status: 'active'
        });


        await adminUser.save();
        console.log('Default administrator user successfully created');
    } catch (error) {
        console.error('Error creating default user:', error);
    }
};

module.exports = { createAdmin };