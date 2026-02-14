const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplierController');
const verifyToken = require('../middlewares/authMiddleware');

router.get('/', verifyToken, supplierController.getSuppliers);
router.post('/', verifyToken, supplierController.createSupplier);

module.exports = router;