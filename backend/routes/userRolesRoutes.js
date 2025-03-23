// routes/userRolesRoutes.js
const express = require('express');
const router = express.Router();
const urController = require('../controllers/userRolesController');
// Import your authentication middleware
const authMiddleware = require('../middleware/authMiddleware');

// GET all (protected)
router.get('/', authMiddleware, urController.getAllUserRoles);

// GET by composite key (protected)
router.get('/:user_id/:role_id', authMiddleware, urController.getUserRole);

// POST create (protected)
router.post('/', authMiddleware, urController.createUserRole);

// PUT update (protected)
router.put('/:user_id/:role_id', authMiddleware, urController.updateUserRole);

// DELETE (protected)
router.delete('/:user_id/:role_id', authMiddleware, urController.deleteUserRole);

module.exports = router;
