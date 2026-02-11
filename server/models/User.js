const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: [true, 'First name is required'] },
    lastName: { type: String, required: [true, 'Last name is required'] },
    email: { 
        type: String, 
        required: [true, 'Email is required'],
        unique: [true, 'Email already exists'] 
    },
    phone: { type: String },
    password: { type: String, required: [true, 'Password is required'] },
    role: { 
        type: String, 
        required: [true, 'Role is required'],
        enum: {
            values: ['ADMIN', 'MANAGER', 'SELLER'], // Cambiamos los nombres de los roles
            message: '{VALUE} is not a valid role'
        },
        default: 'SELLER' 
    },
    status: { 
        type: String, 
        enum: {
            values: ['active', 'inactive'],
            message: '{VALUE} is not a valid status'
        },
        default: 'active'
    },
}, { timestamps: true }); // Esto agrega createdAt y updatedAt automáticamente

module.exports = mongoose.model('User', userSchema);