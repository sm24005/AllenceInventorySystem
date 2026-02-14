const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
    invoiceNumber: { type: String, required: true }, // Número de factura del proveedor
    supplier: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Supplier',
        required: true 
    },
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', // Quién registró la compra
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
        unitCost: { type: Number, required: true } // Cuánto nos costó cada uno
    }],
    total: { type: Number, required: true },
    status: { type: String, default: 'completed' }
}, { timestamps: true });

module.exports = mongoose.model('Purchase', purchaseSchema);