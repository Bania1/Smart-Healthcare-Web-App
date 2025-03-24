// routes/rolePermissionsRoutes.js
const express = require('express');
const router = express.Router();
const rpController = require('../controllers/rolePermissionsController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

/**
 * We'll assume only "Admin" can manage role-permissions.
 */

// GET all => "Admin"
router.get('/', authMiddleware, roleMiddleware(['Admin']), rpController.getAllRolePermissions);

// GET by composite key => "Admin"
router.get('/:role_id/:permission_id', authMiddleware, roleMiddleware(['Admin']), rpController.getRolePermission);

// POST create => "Admin"
router.post('/', authMiddleware, roleMiddleware(['Admin']), rpController.createRolePermission);

// PUT update => "Admin"
router.put('/:role_id/:permission_id', authMiddleware, roleMiddleware(['Admin']), rpController.updateRolePermission);

// DELETE => "Admin"
router.delete('/:role_id/:permission_id', authMiddleware, roleMiddleware(['Admin']), rpController.deleteRolePermission);

module.exports = router;
