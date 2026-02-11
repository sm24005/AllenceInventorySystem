const mongoose = require('mongoose');

const saleItemSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: [1, 'Quantity must be at least 1'] },
    price: { type: Number, required: true }
}, { _id: false });

const saleSchema = new mongoose.Schema({
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [saleItemSchema],
    totalAmount: { type: Number, required: true, default: 0 },
    status: { 
        type: String, 
        enum: { values: ['completed', 'cancelled'], message: '{VALUE} is not a valid status' },
        default: 'completed' 
    }
}, { timestamps: true });

module.exports = mongoose.model('Sale', saleSchema);