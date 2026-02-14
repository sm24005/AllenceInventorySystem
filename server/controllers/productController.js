const Product = require('../models/Product');

exports.createProduct = async (req, res) => {
    try {      
        const newProduct = new Product(req.body);
        await newProduct.save();

        res.status(201).json({ 
            success: true, 
            message: 'Product registered successfully',
            product: newProduct
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ success: false, errors });
        }
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                errors: ['The product SKU is already registered']
            });
        }
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.getProducts = async (req, res) => {
    try {
        const { sku, name } = req.query;
        let query = {};
        
        if (name) query.name = { $regex: name, $options: 'i' };
        if (sku) query.sku = { $regex: sku, $options: 'i' };

        const products = await Product.find(query)
        
        .sort({ createdAt: -1 });
        res.json({ success: true, count: products.length, products });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
        
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        res.json({ success: true, product });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        
        if (!updatedProduct) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        res.json({ success: true, message: 'Product updated', product: updatedProduct });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ success: false, errors });
        }
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                errors: ['The product SKU is already registered']
            });
        }
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        res.json({ success: true, message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};