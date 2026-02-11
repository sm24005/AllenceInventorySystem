const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const verifyToken = require('../middlewares/authMiddleware');
const requireRole = require('../middlewares/roleMiddleware');

// Todos pueden ver la lista de clientes
router.get('/', verifyToken, customerController.getCustomers);
router.get('/:id', verifyToken, customerController.getCustomerById);

// ADMIN, MANAGER y SELLER pueden crear o editar clientes
router.post('/', verifyToken, requireRole('ADMIN', 'MANAGER', 'SELLER'), customerController.createCustomer);
router.put('/:id', verifyToken, requireRole('ADMIN', 'MANAGER', 'SELLER'), customerController.updateCustomer);

// Solo el ADMIN puede eliminar clientes
router.delete('/:id', verifyToken, requireRole('ADMIN'), customerController.deleteCustomer);

module.exports = router;