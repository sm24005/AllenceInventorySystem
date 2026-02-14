const Category = require('../models/Category');

exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.find().sort({ name: 1 });
        res.json({ success: true, categories });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.createCategory = async (req, res) => {
    try {
        const newCategory = new Category(req.body);
        await newCategory.save();
        res.status(201).json({ success: true, category: newCategory });
    } catch (error) {
        if (error.code === 11000) return res.status(400).json({ success: false, message: 'Category already exists' });
        res.status(400).json({ success: false, error: error.message });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        await Category.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Category deleted' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};