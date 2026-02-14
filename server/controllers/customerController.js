const Customer = require('../models/Customer');

// Obtener clientes (con filtros)
exports.getCustomers = async (req, res) => {
    try {
        const { name, nationalId } = req.query;
        let query = {};

        if (name) query.name = { $regex: name, $options: 'i' };
        if (nationalId) query.nationalId = { $regex: nationalId, $options: 'i' };

        const customers = await Customer.find(query).sort({ createdAt: -1 });
        res.json({ success: true, count: customers.length, customers });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Obtener uno por ID
exports.getCustomerById = async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);
        if (!customer) return res.status(404).json({ success: false, message: 'Customer not found' });
        res.json({ success: true, customer });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Crear cliente
exports.createCustomer = async (req, res) => {
    try {
        // Verificar duplicados (DUI o Email)
        const { nationalId, email } = req.body;
        
        const existsDui = await Customer.findOne({ nationalId });
        if (existsDui) return res.status(400).json({ success: false, message: 'National ID already registered' });

        if (email) {
            const existsEmail = await Customer.findOne({ email });
            if (existsEmail) return res.status(400).json({ success: false, message: 'Email already registered' });
        }

        const newCustomer = new Customer(req.body);
        await newCustomer.save();
        
        res.status(201).json({ success: true, message: 'Customer created successfully', customer: newCustomer });
    } catch (error) {
        if (error.code === 11000) return res.status(400).json({ success: false, message: 'Duplicate data found' });
        res.status(400).json({ success: false, error: error.message });
    }
};

// Actualizar cliente
exports.updateCustomer = async (req, res) => {
    try {
        const updatedCustomer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedCustomer) return res.status(404).json({ success: false, message: 'Customer not found' });
        
        res.json({ success: true, message: 'Customer updated', customer: updatedCustomer });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// Eliminar cliente
exports.deleteCustomer = async (req, res) => {
    try {
        const customer = await Customer.findByIdAndDelete(req.params.id);
        if (!customer) return res.status(404).json({ success: false, message: 'Customer not found' });
        res.json({ success: true, message: 'Customer deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};