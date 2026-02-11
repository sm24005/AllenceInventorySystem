const Sale = require('../models/Sale');
const Product = require('../models/Product');

exports.createSale = async (req, res) => {
    try {
        const { customer, items } = req.body;
        const sellerId = req.user.id;

        let totalAmount = 0;

        for (let item of items) {
            const productDB = await Product.findById(item.product);
            if (!productDB) {
                return res.status(404).json({ success: false, message: `Product ${item.product} not found` });
            }
            if (productDB.stock < item.quantity) {
                return res.status(400).json({ success: false, message: `Not enough stock for ${productDB.name}` });
            }
            totalAmount += productDB.price * item.quantity;
            item.price = productDB.price; 
        }

        const newSale = new Sale({ customer, seller: sellerId, items, totalAmount });
        await newSale.save();

        for (let item of items) {
            await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
        }

        res.status(201).json({ success: true, message: 'Sale completed successfully', sale: newSale });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.getSales = async (req, res) => {
    try {
        const sales = await Sale.find()
            .populate('customer', 'name nationalId')
            .populate('seller', 'firstName lastName email')
            .populate('items.product', 'name sku')
            .sort({ createdAt: -1 });
        res.json({ success: true, count: sales.length, sales });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};