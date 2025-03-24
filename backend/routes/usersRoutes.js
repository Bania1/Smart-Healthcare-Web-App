// routes/usersRoutes.js
const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Only Admin can do anything with users
router.get('/', authMiddleware, roleMiddleware(['Admin']), usersController.getAllUsers);
router.get('/:id', authMiddleware, roleMiddleware(['Admin']), usersController.getUserById);
router.post('/', authMiddleware, roleMiddleware(['Admin']), usersController.createUser);
router.put('/:id', authMiddleware, roleMiddleware(['Admin']), usersController.updateUser);
router.delete('/:id', authMiddleware, roleMiddleware(['Admin']), usersController.deleteUser);

module.exports = router;
