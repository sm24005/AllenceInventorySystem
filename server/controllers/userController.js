const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email, status: 'active' });
        if (!user) return res.status(400).json({ success: false, message: 'User not found or inactive' });

        const validPass = await bcrypt.compare(password, user.password);
        if (!validPass) return res.status(400).json({ success: false, message: 'Invalid credentials' });

        const payload = { id: user._id, role: user.role, email: user.email };
        const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret_key', { expiresIn: '8h' });

        res.json({ 
            success: true, 
            token, 
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role
            },
            message: "Welcome " + user.firstName 
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
