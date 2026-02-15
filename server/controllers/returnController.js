const Return = require('../models/Return');
const Sale = require('../models/Sale');
const Product = require('../models/Product');

exports.createReturn = async (req, res) => {
    try {
        const { invoiceNumber, items, reason } = req.body;
        const userId = req.user.id;

        // 1. Buscar la Venta Original
        const sale = await Sale.findOne({ invoiceNumber });
        if (!sale) return res.status(404).json({ message: 'Invoice not found' });

        let totalRefund = 0;
        const processedItems = [];

        // 2. Procesar cada ítem devuelto
        for (const item of items) {
            // Verificar que el producto estaba en la venta original (seguridad básica)
            const originalItem = sale.items.find(i => i.product.toString() === item.productId);
            
            if (!originalItem) continue; // Si no estaba en la venta, lo ignoramos

            const refundLine = originalItem.price * item.quantity;
            totalRefund += refundLine;

            processedItems.push({
                product: item.productId,
                productName: originalItem.productName,
                quantity: item.quantity,
                condition: item.condition,
                refundAmount: refundLine
            });

            // 3. LOGICA DE STOCK: Solo reabastecer si está en buen estado ('Good')
            if (item.condition === 'Good') {
                await Product.findByIdAndUpdate(item.productId, {
                    $inc: { stock: item.quantity }
                });
            }
        }

        if (processedItems.length === 0) {
            return res.status(400).json({ message: 'No valid items to return' });
        }

        // 4. Guardar la Devolución
        const newReturn = new Return({
            sale: sale._id,
            invoiceNumber: sale.invoiceNumber,
            user: userId,
            items: processedItems,
            totalRefund,
            reason
        });

        await newReturn.save();

        res.status(201).json({ success: true, message: 'Return processed successfully', return: newReturn });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.getReturns = async (req, res) => {
    try {
        const returns = await Return.find()
            .populate('user', 'firstName lastName')
            .sort({ createdAt: -1 });
        res.json({ success: true, returns });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};