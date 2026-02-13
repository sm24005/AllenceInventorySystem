const Purchase = require('../models/Purchase');
const Product = require('../models/Product');

exports.createPurchase = async (req, res) => {
    try {
        const { supplier, items } = req.body;
        const userId = req.user.id; // El usuario logueado (Admin/Manager)

        let totalAmount = 0;

        // 1. Verificar productos y calcular total
        for (let item of items) {
            const productDB = await Product.findById(item.product);
            if (!productDB) {
                return res.status(404).json({ success: false, message: `Product ${item.product} not found` });
            }
            totalAmount += item.cost * item.quantity;
        }

        // 2. Guardar la Compra
        const newPurchase = new Purchase({ supplier, user: userId, items, totalAmount });
        await newPurchase.save();

        // 3. AUMENTAR el stock del inventario automáticamente
        for (let item of items) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: { stock: item.quantity } // Suma la cantidad al stock actual
            });
        }

        res.status(201).json({ success: true, message: 'Purchase registered successfully', purchase: newPurchase });

    } catch (error) {
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ success: false, errors });
        }
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.getPurchases = async (req, res) => {
    try {
        const purchases = await Purchase.find()
            .populate('supplier', 'name email')
            .populate('user', 'firstName lastName')
            .populate('items.product', 'name sku')
            .sort({ createdAt: -1 });
            
        res.json({ success: true, count: purchases.length, purchases });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};