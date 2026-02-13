const Brand = require('../models/Brand');

exports.createBrand = async (req, res) => {
    try {
        const newBrand = new Brand(req.body);
        await newBrand.save();
        res.status(201).json({ success: true, brand: newBrand });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: 'Brand name already exists' });
        }
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.getBrands = async (req, res) => {
    try {
        const brands = await Brand.find().sort({ name: 1 });
        res.json({ success: true, count: brands.length, brands });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.updateBrand = async (req, res) => {
    try {
        const brand = await Brand.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!brand) return res.status(404).json({ success: false, message: 'Brand not found' });
        res.json({ success: true, brand });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.deleteBrand = async (req, res) => {
    try {
        const brand = await Brand.findByIdAndDelete(req.params.id);
        if (!brand) return res.status(404).json({ success: false, message: 'Brand not found' });
        res.json({ success: true, message: 'Brand deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};