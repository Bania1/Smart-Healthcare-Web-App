// routes/rolePermissionsRoutes.js
const express = require('express');
const router = express.Router();
const rpController = require('../controllers/rolePermissionsController');

// GET all
router.get('/', rpController.getAllRolePermissions);

// GET by composite key
router.get('/:role_id/:permission_id', rpController.getRolePermission);

// POST create
router.post('/', rpController.createRolePermission);

// PUT update
router.put('/:role_id/:permission_id', rpController.updateRolePermission);

// DELETE
router.delete('/:role_id/:permission_id', rpController.deleteRolePermission);

module.exports = router;
