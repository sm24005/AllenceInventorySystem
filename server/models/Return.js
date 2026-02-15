const mongoose = require('mongoose');

const returnSchema = new mongoose.Schema({
    sale: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Sale',
        required: true 
    },
    invoiceNumber: { type: String, required: true },
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', // Empleado que procesó la devolución
        required: true 
    },
    items: [{
        product: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Product',
            required: true 
        },
        productName: String,
        quantity: { type: Number, required: true, min: 1 },
        condition: { 
            type: String, 
            enum: ['Good', 'Defective'], 
            default: 'Good' 
        },
        refundAmount: { type: Number, required: true } // Dinero devuelto por estos items
    }],
    totalRefund: { type: Number, required: true },
    reason: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Return', returnSchema);