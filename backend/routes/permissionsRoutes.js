// routes/permissionsRoutes.js
const express = require('express');
const router = express.Router();
const permissionsController = require('../controllers/permissionsController');
// Import your authentication middleware
const authMiddleware = require('../middleware/authMiddleware');

// GET all permissions (protected)
router.get('/', authMiddleware, permissionsController.getAllPermissions);

// GET permission by ID (protected)
router.get('/:id', authMiddleware, permissionsController.getPermissionById);

// POST create permission (protected)
router.post('/', authMiddleware, permissionsController.createPermission);

// PUT update permission (protected)
router.put('/:id', authMiddleware, permissionsController.updatePermission);

// DELETE permission (protected)
router.delete('/:id', authMiddleware, permissionsController.deletePermission);

module.exports = router;
