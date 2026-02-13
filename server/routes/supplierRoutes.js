const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplierController');
const verifyToken = require('../middlewares/authMiddleware');
const requireRole = require('../middlewares/roleMiddleware');

router.get('/', verifyToken, supplierController.getSuppliers);
router.post('/', verifyToken, requireRole('ADMIN', 'MANAGER'), supplierController.createSupplier);
router.put('/:id', verifyToken, requireRole('ADMIN', 'MANAGER'), supplierController.updateSupplier);
router.delete('/:id', verifyToken, requireRole('ADMIN'), supplierController.deleteSupplier);

module.exports = router;