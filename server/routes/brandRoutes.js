const express = require('express');
const router = express.Router();
const brandController = require('../controllers/brandController');
const verifyToken = require('../middlewares/authMiddleware');
const requireRole = require('../middlewares/roleMiddleware');

router.get('/', verifyToken, brandController.getBrands);
router.post('/', verifyToken, requireRole('ADMIN', 'MANAGER'), brandController.createBrand);
router.delete('/:id', verifyToken, requireRole('ADMIN', 'MANAGER'), brandController.deleteBrand);

module.exports = router;