const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
    invoiceNumber: { 
        type: String, 
        unique: true,
        required: true 
    },
    customer: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Customer',
        required: true 
    },
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', // El vendedor que hizo la venta
        required: true 
    },
    items: [{
        product: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Product',
            required: true 
        },
        productName: String, // Guardamos el nombre por si el producto se borra después
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true } // Precio al momento de la venta
    }],
    total: { 
        type: Number, 
        required: true 
    },
    status: {
        type: String,
        enum: ['completed', 'cancelled'],
        default: 'completed'
    }
}, { timestamps: true });

module.exports = mongoose.model('Sale', saleSchema);