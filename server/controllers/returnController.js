const Return = require('../models/Return');
const Sale = require('../models/Sale');
const Product = require('../models/Product');

exports.createReturn = async (req, res) => {
    try {
        const { saleId, productId, quantity, reason } = req.body;

        // 1. Buscar la venta original
        const sale = await Sale.findById(saleId);
        if (!sale) return res.status(404).json({ success: false, message: 'Sale not found' });

        // 2. Buscar el producto DENTRO de esa venta
        const soldItem = sale.items.find(item => item.product.toString() === productId);
        if (!soldItem) {
            return res.status(400).json({ success: false, message: 'This product was not part of the sale' });
        }

        // 3. Validar que no devuelvan más de lo que compraron
        if (quantity > soldItem.quantity) {
            return res.status(400).json({ success: false, message: 'Cannot return more items than purchased' });
        }

        // 4. Calcular reembolso (usando el precio histórico de la venta)
        const refundAmount = soldItem.price * quantity;

        // 5. Guardar la Devolución
        const newReturn = new Return({
            sale: saleId,
            product: productId,
            quantity,
            reason,
            refundAmount
        });
        await newReturn.save();

        // 6. RESTAURAR el stock (El producto vuelve al estante)
        await Product.findByIdAndUpdate(productId, {
            $inc: { stock: quantity } 
        });

        res.status(201).json({ 
            success: true, 
            message: 'Return processed successfully', 
            refund: refundAmount,
            return: newReturn 
        });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.getReturns = async (req, res) => {
    try {
        const returns = await Return.find()
            .populate('sale', 'totalAmount') // Vemos el total de la venta original
            .populate('product', 'name sku') // Vemos qué producto fue
            .sort({ createdAt: -1 });
            
        res.json({ success: true, count: returns.length, returns });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};