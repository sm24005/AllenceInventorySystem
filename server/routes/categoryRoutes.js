const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const verifyToken = require('../middlewares/authMiddleware');
const requireRole = require('../middlewares/roleMiddleware');

router.get('/', verifyToken, categoryController.getCategories);

// Solo Admin y Manager pueden crear/editar/borrar categorías
router.post('/', verifyToken, requireRole('ADMIN', 'MANAGER'), categoryController.createCategory);
router.put('/:id', verifyToken, requireRole('ADMIN', 'MANAGER'), categoryController.updateCategory);
router.delete('/:id', verifyToken, requireRole('ADMIN'), categoryController.deleteCategory);

module.exports = router;