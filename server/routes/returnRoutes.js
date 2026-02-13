const express = require('express');
const router = express.Router();
const returnController = require('../controllers/returnController');
const verifyToken = require('../middlewares/authMiddleware');
const requireRole = require('../middlewares/roleMiddleware');

router.get('/', verifyToken, requireRole('ADMIN', 'MANAGER'), returnController.getReturns);
router.post('/', verifyToken, requireRole('ADMIN', 'MANAGER', 'SELLER'), returnController.createReturn);

module.exports = router;