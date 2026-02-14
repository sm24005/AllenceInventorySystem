const Supplier = require('../models/Supplier');

exports.getSuppliers = async (req, res) => {
    try {
        const suppliers = await Supplier.find({ status: 'active' }).sort({ createdAt: -1 });
        res.json({ success: true, suppliers });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.createSupplier = async (req, res) => {
    try {
        const newSupplier = new Supplier(req.body);
        await newSupplier.save();
        res.status(201).json({ success: true, supplier: newSupplier });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};