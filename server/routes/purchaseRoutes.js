const express = require('express');
const router = express.Router();
const purchaseController = require('../controllers/purchaseController');
const verifyToken = require('../middlewares/authMiddleware');
const requireRole = require('../middlewares/roleMiddleware');

router.get('/', verifyToken, requireRole('ADMIN', 'MANAGER'), purchaseController.getPurchases);
router.post('/', verifyToken, requireRole('ADMIN', 'MANAGER'), purchaseController.createPurchase);

module.exports = router;