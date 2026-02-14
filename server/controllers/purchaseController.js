const Purchase = require('../models/Purchase');
const Product = require('../models/Product');

exports.createPurchase = async (req, res) => {
    try {
        const { supplierId, invoiceNumber, items } = req.body;
        const userId = req.user.id;

        let total = 0;
        const processedItems = [];

        // 1. Procesar items y calcular total
        for (const item of items) {
            const product = await Product.findById(item.productId);
            if (!product) return res.status(404).json({ message: `Product not found: ${item.productId}` });

            processedItems.push({
                product: product._id,
                productName: product.name,
                quantity: item.quantity,
                unitCost: item.unitCost
            });
            
            total += item.unitCost * item.quantity;
        }

        // 2. Crear la Compra
        const newPurchase = new Purchase({
            invoiceNumber,
            supplier: supplierId,
            user: userId,
            items: processedItems,
            total
        });

        await newPurchase.save();

        // 3. AUMENTAR Stock (La clave de las compras)
        for (const item of processedItems) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: { stock: item.quantity } 
            });
        }

        res.status(201).json({ success: true, message: 'Purchase registered & Stock updated', purchase: newPurchase });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.getPurchases = async (req, res) => {
    try {
        const purchases = await Purchase.find()
            .populate('supplier', 'name')
            .populate('user', 'firstName lastName')
            .sort({ createdAt: -1 });
        res.json({ success: true, purchases });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};