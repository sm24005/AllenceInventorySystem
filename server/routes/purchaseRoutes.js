const express = require('express');
const router = express.Router();
const purchaseController = require('../controllers/purchaseController');
const verifyToken = require('../middlewares/authMiddleware');
const requireRole = require('../middlewares/roleMiddleware');

// Solo Admin y Manager deberían poder registrar compras (entradas de inventario)
router.get('/', verifyToken, purchaseController.getPurchases);
router.post('/', verifyToken, requireRole('ADMIN', 'MANAGER'), purchaseController.createPurchase);

module.exports = router;