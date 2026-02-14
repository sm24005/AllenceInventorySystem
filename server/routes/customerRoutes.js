const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController'); 

const verifyToken = require('../middlewares/authMiddleware'); 
const requireRole = require('../middlewares/roleMiddleware');

router.get('/', verifyToken, customerController.getCustomers);
router.get('/:id', verifyToken, customerController.getCustomerById);

// Crear y Editar (Admin, Manager y Seller)
router.post('/', verifyToken, requireRole('ADMIN', 'MANAGER', 'SELLER'), customerController.createCustomer);
router.put('/:id', verifyToken, requireRole('ADMIN', 'MANAGER', 'SELLER'), customerController.updateCustomer);

// Borrar (Solo Admin y Manager)
router.delete('/:id', verifyToken, requireRole('ADMIN', 'MANAGER'), customerController.deleteCustomer);

module.exports = router;