const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const verifyToken = require('../middlewares/authMiddleware');
const requireRole = require('../middlewares/roleMiddleware');

// Ruta Pública
router.post('/login', userController.login);

// Rutas Privadas (Gestión de Usuarios)

// Ver usuarios: Admin y Manager
router.get('/', verifyToken, requireRole('ADMIN', 'MANAGER'), userController.getUsers);
router.get('/:id', verifyToken, requireRole('ADMIN', 'MANAGER'), userController.getUserById);

// Crear, Editar, Borrar: SOLO ADMIN
router.post('/', verifyToken, requireRole('ADMIN'), userController.createUser);
router.put('/:id', verifyToken, requireRole('ADMIN'), userController.updateUser);
router.delete('/:id', verifyToken, requireRole('ADMIN'), userController.deleteUser);

module.exports = router;