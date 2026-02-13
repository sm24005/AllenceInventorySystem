const Supplier = require('../models/Supplier');

exports.createSupplier = async (req, res) => {
    try {
        const newSupplier = new Supplier(req.body);
        await newSupplier.save();

        res.status(201).json({ 
            success: true, 
            message: 'Supplier registered successfully',
            supplier: newSupplier
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: 'The email is already registered for another supplier' });
        }
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ success: false, errors });
        }
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.getSuppliers = async (req, res) => {
    try {
        const suppliers = await Supplier.find().sort({ createdAt: -1 });
        res.json({ success: true, count: suppliers.length, suppliers });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.updateSupplier = async (req, res) => {
    try {
        const updatedSupplier = await Supplier.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedSupplier) return res.status(404).json({ success: false, message: 'Supplier not found' });
        
        res.json({ success: true, message: 'Supplier updated', supplier: updatedSupplier });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.deleteSupplier = async (req, res) => {
    try {
        const deletedSupplier = await Supplier.findByIdAndDelete(req.params.id);
        if (!deletedSupplier) return res.status(404).json({ success: false, message: 'Supplier not found' });
        
        res.json({ success: true, message: 'Supplier deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};