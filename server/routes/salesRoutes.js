const express = require('express');
const router = express.Router();
const saleController = require('../controllers/saleController');
const verifyToken = require('../middlewares/authMiddleware');

router.get('/', verifyToken, saleController.getSales);
router.post('/', verifyToken, saleController.createSale);

module.exports = router;