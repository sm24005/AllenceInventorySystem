const Sale = require('../models/Sale');
const Product = require('../models/Product');

exports.createSale = async (req, res) => {
    try {
        const { customerId, items } = req.body;
        const userId = req.user.id; // Viene del token

        // 1. Validar Stock y Calcular Total
        let total = 0;
        const processedItems = [];

        for (const item of items) {
            const product = await Product.findById(item.productId);
            
            if (!product) {
                return res.status(404).json({ success: false, message: `Product not found: ${item.productId}` });
            }
            if (product.stock < item.quantity) {
                return res.status(400).json({ success: false, message: `Insufficient stock for ${product.name}. Available: ${product.stock}` });
            }

            // Agregamos a la lista procesada
            processedItems.push({
                product: product._id,
                productName: product.name,
                quantity: item.quantity,
                price: product.price
            });
            
            total += product.price * item.quantity;
        }

        // 2. Crear la Venta
        // Generar número de factura simple (EJ: INV-170123456789)
        const invoiceNumber = 'INV-' + Date.now(); 

        const newSale = new Sale({
            invoiceNumber,
            customer: customerId,
            user: userId,
            items: processedItems,
            total,
            status: 'completed'
        });

        await newSale.save();

        // 3. Descontar Stock (¡Paso Crítico!)
        for (const item of processedItems) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: { stock: -item.quantity } // Restamos la cantidad
            });
        }

        res.status(201).json({ success: true, message: 'Sale registered successfully', sale: newSale });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Obtener todas las ventas
exports.getSales = async (req, res) => {
    try {
        const sales = await Sale.find()
            .populate('customer', 'name nationalId') // Traer nombre del cliente
            .populate('user', 'firstName lastName')  // Traer nombre del vendedor
            .sort({ createdAt: -1 });

        res.json({ success: true, count: sales.length, sales });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};