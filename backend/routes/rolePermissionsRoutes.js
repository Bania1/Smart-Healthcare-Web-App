// routes/rolePermissionsRoutes.js
const express = require('express');
const router = express.Router();
const rpController = require('../controllers/rolePermissionsController');
// Import your authentication middleware
const authMiddleware = require('../middleware/authMiddleware');

// GET all (protected)
router.get('/', authMiddleware, rpController.getAllRolePermissions);

// GET by composite key (protected)
router.get('/:role_id/:permission_id', authMiddleware, rpController.getRolePermission);

// POST create (protected)
router.post('/', authMiddleware, rpController.createRolePermission);

// PUT update (protected)
router.put('/:role_id/:permission_id', authMiddleware, rpController.updateRolePermission);

// DELETE (protected)
router.delete('/:role_id/:permission_id', authMiddleware, rpController.deleteRolePermission);

module.exports = router;
