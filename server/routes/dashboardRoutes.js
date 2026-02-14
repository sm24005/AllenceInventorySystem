const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const verifyToken = require('../middlewares/authMiddleware');

// Cualquier usuario logueado puede ver el dashboard básico
router.get('/', verifyToken, dashboardController.getDashboardStats);

module.exports = router;