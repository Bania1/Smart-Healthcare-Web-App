// routes/rolesRoutes.js
const express = require('express');
const router = express.Router();
const rolesController = require('../controllers/rolesController');
// Import your authentication middleware
const authMiddleware = require('../middleware/authMiddleware');

// GET all roles (protected)
router.get('/', authMiddleware, rolesController.getAllRoles);

// GET role by ID (protected)
router.get('/:id', authMiddleware, rolesController.getRoleById);

// POST create role (protected)
router.post('/', authMiddleware, rolesController.createRole);

// PUT update role (protected)
router.put('/:id', authMiddleware, rolesController.updateRole);

// DELETE role (protected)
router.delete('/:id', authMiddleware, rolesController.deleteRole);

module.exports = router;
