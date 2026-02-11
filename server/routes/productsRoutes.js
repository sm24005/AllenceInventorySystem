const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const verifyToken = require('../middlewares/authMiddleware');
const requireRole = require('../middlewares/roleMiddleware');

// Todos los que tengan token pueden ver productos
router.get('/', verifyToken, productController.getProducts);
router.get('/:id', verifyToken, productController.getProductById);

// Solo ADMIN y MANAGER pueden crear o editar productos
router.post('/', verifyToken, requireRole('ADMIN', 'MANAGER'), productController.createProduct);
router.put('/:id', verifyToken, requireRole('ADMIN', 'MANAGER'), productController.updateProduct);

// Solo el ADMIN puede eliminar productos permanentemente
router.delete('/:id', verifyToken, requireRole('ADMIN'), productController.deleteProduct);

module.exports = router;