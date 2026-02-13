const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, 'Supplier name is required'],
        trim: true 
    },
    contactName: { type: String }, // Persona de contacto
    email: { 
        type: String, 
        required: [true, 'Email is required'],
        unique: true,
        match: [/.+\@.+\..+/, 'Please enter a valid email address']
    },
    phone: { type: String, required: [true, 'Phone number is required'] },
    address: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Supplier', supplierSchema);