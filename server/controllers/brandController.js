const Brand = require('../models/Brand');

exports.getBrands = async (req, res) => {
    try {
        const brands = await Brand.find().sort({ name: 1 });
        res.json({ success: true, brands });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.createBrand = async (req, res) => {
    try {
        const newBrand = new Brand(req.body);
        await newBrand.save();
        res.status(201).json({ success: true, brand: newBrand });
    } catch (error) {
        if (error.code === 11000) return res.status(400).json({ success: false, message: 'Brand already exists' });
        res.status(400).json({ success: false, error: error.message });
    }
};

exports.deleteBrand = async (req, res) => {
    try {
        await Brand.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Brand deleted' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};