// routes/permissionsRoutes.js
const express = require('express');
const router = express.Router();
const permissionsController = require('../controllers/permissionsController');
// Middlewares
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

/**
 * Only an "Admin" can get, create, update, or delete permissions.
 */

// GET all permissions => "Admin"
router.get('/', authMiddleware, roleMiddleware(['Admin']), permissionsController.getAllPermissions);

// GET permission by ID => "Admin"
router.get('/:id', authMiddleware, roleMiddleware(['Admin']), permissionsController.getPermissionById);

// POST create permission => "Admin"
router.post('/', authMiddleware, roleMiddleware(['Admin']), permissionsController.createPermission);

// PUT update permission => "Admin"
router.put('/:id', authMiddleware, roleMiddleware(['Admin']), permissionsController.updatePermission);

// DELETE permission => "Admin"
router.delete('/:id', authMiddleware, roleMiddleware(['Admin']), permissionsController.deletePermission);

module.exports = router;
