const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const verifyToken = require('../middlewares/authMiddleware');
const requireRole = require('../middlewares/roleMiddleware');

router.get('/', verifyToken, categoryController.getCategories);
router.post('/', verifyToken, requireRole('ADMIN', 'MANAGER'), categoryController.createCategory);
router.delete('/:id', verifyToken, requireRole('ADMIN', 'MANAGER'), categoryController.deleteCategory);

module.exports = router;