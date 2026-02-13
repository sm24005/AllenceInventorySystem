const mongoose = require('mongoose');

const purchaseItemSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: [1, 'Quantity must be at least 1'] },
    cost: { type: Number, required: true } // Costo unitario al que lo compramos
}, { _id: false });

const purchaseSchema = new mongoose.Schema({
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Quién registró la compra
    items: [purchaseItemSchema],
    totalAmount: { type: Number, required: true, default: 0 },
    status: { 
        type: String, 
        default: 'completed' 
    }
}, { timestamps: true });

module.exports = mongoose.model('Purchase', purchaseSchema);