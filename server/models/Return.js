const mongoose = require('mongoose');

const returnSchema = new mongoose.Schema({
    sale: { type: mongoose.Schema.Types.ObjectId, ref: 'Sale', required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: [1, 'Quantity must be at least 1'] },
    reason: { type: String, required: true }, // Ej: "Defectuoso", "No le gustó"
    refundAmount: { type: Number, required: true }, // Cuánto dinero se devolvió
    date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Return', returnSchema);