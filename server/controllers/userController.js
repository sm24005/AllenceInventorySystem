const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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

// --- NUEVAS FUNCIONES CRUD ---

// 1. Obtener todos los usuarios (sin mostrar password)
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.json({ success: true, users });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// 2. Obtener un usuario por ID
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// 3. Crear nuevo usuario (Solo Admin)
exports.createUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password, role } = req.body;

        // Verificar duplicado
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ success: false, message: 'Email already registered' });

        // Encriptar password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            role: role || 'SELLER', // Rol por defecto
            status: 'active'
        });

        await newUser.save();
        res.status(201).json({ success: true, message: 'User created successfully', user: newUser });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// 4. Actualizar usuario
exports.updateUser = async (req, res) => {
    try {
        const { firstName, lastName, email, role, password, status } = req.body;
        const updateData = { firstName, lastName, email, role, status };

        // Si envían password nuevo, lo encriptamos. Si no, no tocamos el password.
        if (password && password.trim() !== '') {
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(password, salt);
        }

        const updatedUser = await User.findByIdAndUpdate(req.params.id, updateData, { new: true }).select('-password');
        
        if (!updatedUser) return res.status(404).json({ success: false, message: 'User not found' });
        
        res.json({ success: true, message: 'User updated successfully', user: updatedUser });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// 5. Eliminar usuario (Soft delete o Hard delete)
exports.deleteUser = async (req, res) => {
    try {
        // Opción A: Borrado Físico
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        
        // Opción B: Desactivar (Recomendado para mantener historial de ventas)
        // const deletedUser = await User.findByIdAndUpdate(req.params.id, { status: 'inactive' });

        if (!deletedUser) return res.status(404).json({ success: false, message: 'User not found' });
        res.json({ success: true, message: 'User deleted/deactivated successfully' });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};