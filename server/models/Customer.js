const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, 'Name is required'],
        trim: true
    },
    address: { 
        type: String,
        trim: true
    },
    nationalId: { 
        type: String,
        required: [true, 'National ID (DUI) is required'],
        unique: true,
        trim: true,
        match: [/^\d{8}-\d{1}$/, 'Invalid format. Use 00000000-0']
    },
    phone: { 
        type: String,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        // El email no es obligatorio, pero si lo ponen, debe ser válido
        match: [/.+\@.+\..+/, 'Please enter a valid email address']
    }
}, { timestamps: true });

module.exports = mongoose.model('Customer', customerSchema);