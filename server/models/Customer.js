const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    name: { type: String, required: [true, 'Name is required'] },
    address: { type: String },
    nationalId: { // Este es el equivalente al DUI
        type: String,
        required: [true, 'National ID is required'],
        unique: [true, 'National ID already exists'],
        trim: true,
        match: [/^\d{8}-\d{1}$/, 'Please enter a valid National ID format (00000000-0)']
    },
    phone: { type: String }    
}, { timestamps: true });

module.exports = mongoose.model('Customer', customerSchema);