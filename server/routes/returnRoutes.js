const express = require('express');
const router = express.Router();
const returnController = require('../controllers/returnController');
const verifyToken = require('../middlewares/authMiddleware');
const requireRole = require('../middlewares/roleMiddleware');

// Ver historial: Todos los autorizados
router.get('/', verifyToken, returnController.getReturns);

// Procesar devolución: Admin y Manager (Vendedores usualmente requieren autorización)
router.post('/', verifyToken, requireRole('ADMIN', 'MANAGER'), returnController.createReturn);

module.exports = router;