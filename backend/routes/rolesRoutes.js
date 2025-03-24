// routes/rolesRoutes.js
const express = require('express');
const router = express.Router();
const rolesController = require('../controllers/rolesController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

/**
 * We'll assume only "Admin" can manage roles.
 */

// GET all roles => "Admin"
router.get('/', authMiddleware, roleMiddleware(['Admin']), rolesController.getAllRoles);

// GET role by ID => "Admin"
router.get('/:id', authMiddleware, roleMiddleware(['Admin']), rolesController.getRoleById);

// POST create role => "Admin"
router.post('/', authMiddleware, roleMiddleware(['Admin']), rolesController.createRole);

// PUT update role => "Admin"
router.put('/:id', authMiddleware, roleMiddleware(['Admin']), rolesController.updateRole);

// DELETE role => "Admin"
router.delete('/:id', authMiddleware, roleMiddleware(['Admin']), rolesController.deleteRole);

module.exports = router;
