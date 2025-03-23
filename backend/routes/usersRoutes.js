// routes/usersRoutes.js
const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
// Importa tu middleware de autenticación
const authMiddleware = require('../middleware/authMiddleware');

// GET all users (protege la ruta si lo deseas)
router.get('/', authMiddleware, usersController.getAllUsers);

// GET user by ID
router.get('/:id', authMiddleware, usersController.getUserById);

// POST create user
router.post('/', authMiddleware, usersController.createUser);

// PUT update user
router.put('/:id', authMiddleware, usersController.updateUser);

// DELETE user
router.delete('/:id', authMiddleware, usersController.deleteUser);

module.exports = router;
