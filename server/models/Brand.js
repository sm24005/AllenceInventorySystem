const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, 'Brand name is required'],
        unique: [true, 'Brand name already exists'],
        trim: true
    },
    description: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Brand', brandSchema);