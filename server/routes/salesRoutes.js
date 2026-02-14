const express = require('express');
const router = express.Router();
const saleController = require('../controllers/saleController');
const verifyToken = require('../middlewares/authMiddleware');
const requireRole = require('../middlewares/roleMiddleware');

// Ver ventas (Admin, Manager y Seller pueden ver su historial)
router.get('/', verifyToken, saleController.getSales);

// Crear venta (Seller, Manager, Admin)
router.post('/', verifyToken, requireRole('ADMIN', 'MANAGER', 'SELLER'), saleController.createSale);

module.exports = router;