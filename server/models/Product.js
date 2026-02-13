const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: [true, 'Product name is required'] },
    description: { type: String },
    sku: { // En lugar de 'codigo', usamos el término técnico 'SKU'
        type: String, 
        required: [true, 'SKU is required'],
        unique: [true, 'SKU already exists'] 
    },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    brand: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand' },
    price: { type: Number, required: true, default: 0 },
    stock: { type: Number, required: true, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);