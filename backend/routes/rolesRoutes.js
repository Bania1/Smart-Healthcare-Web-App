// routes/rolesRoutes.js
const express = require('express');
const router = express.Router();
const rolesController = require('../controllers/rolesController');

// GET all roles
router.get('/', rolesController.getAllRoles);

// GET role by ID
router.get('/:id', rolesController.getRoleById);

// POST create role
router.post('/', rolesController.createRole);

// PUT update role
router.put('/:id', rolesController.updateRole);

// DELETE role
router.delete('/:id', rolesController.deleteRole);

module.exports = router;
