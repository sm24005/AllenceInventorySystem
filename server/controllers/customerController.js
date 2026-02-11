const Customer = require('../models/Customer');

exports.createCustomer = async (req, res) => {
    try {      
        const newCustomer = new Customer(req.body);
        await newCustomer.save();

        res.status(201).json({ 
            success: true, 
            message: 'Customer registered successfully',
            customer: newCustomer
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ success: false, errors });
        }
        if (error.code === 11000) {
             return res.status(400).json({
                success: false,
                message: 'The Customer National ID is already registered'
            });
        }
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.getCustomers = async (req, res) => {
    try {
        const { nationalId, name } = req.query;
        let query = {};
        
        if (name) query.name = { $regex: name, $options: 'i' };
        if (nationalId) query.nationalId = { $regex: nationalId, $options: 'i' };

        // sort({ _id: -1 }) los ordena del más reciente al más antiguo
        const customers = await Customer.find(query).sort({ _id: -1 });
        res.json({ success: true, count: customers.length, customers });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.getCustomerById = async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);
        if (!customer) return res.status(404).json({ success: false, message: 'Customer not found' });
        
        res.json({ success: true, customer });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.updateCustomer = async (req, res) => {
    try {
        const updatedCustomer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedCustomer) return res.status(404).json({ success: false, message: 'Customer not found' });
        
        res.json({ success: true, message: 'Customer updated', customer: updatedCustomer });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ success: false, errors });
        }
        if (error.code === 11000) {
            return res.status(400).json({ success: false, errors: ['The National ID is already registered'] });
        }
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.deleteCustomer = async (req, res) => {
    try {
        const deletedCustomer = await Customer.findByIdAndDelete(req.params.id);
        if (!deletedCustomer) return res.status(404).json({ success: false, message: 'Customer not found' });
        
        res.json({ success: true, message: 'Customer deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};