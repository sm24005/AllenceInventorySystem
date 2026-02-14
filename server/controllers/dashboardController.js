const Product = require('../models/Product');
const Sale = require('../models/Sale');
const Customer = require('../models/Customer');

exports.getDashboardStats = async (req, res) => {
    try {
        // Ejecutamos todas las consultas en paralelo para que sea rápido
        const [
            totalProducts,
            lowStockProducts,
            totalCustomers,
            salesStats
        ] = await Promise.all([
            Product.countDocuments(),
            Product.countDocuments({ stock: { $lt: 5 } }), // Productos con menos de 5 unidades
            Customer.countDocuments(),
            Sale.aggregate([
                { $group: { _id: null, totalRevenue: { $sum: "$total" }, totalSales: { $sum: 1 } } }
            ])
        ]);

        // Ventas recientes (últimas 5)
        const recentSales = await Sale.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('customer', 'name')
            .populate('user', 'firstName lastName');

        res.json({
            success: true,
            stats: {
                totalProducts,
                lowStockCount: lowStockProducts,
                totalCustomers,
                totalRevenue: salesStats[0]?.totalRevenue || 0,
                totalSalesCount: salesStats[0]?.totalSales || 0
            },
            recentSales
        });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};