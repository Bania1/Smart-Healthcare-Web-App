// routes/userRolesRoutes.js
const express = require('express');
const router = express.Router();
const urController = require('../controllers/userRolesController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

/**
 * We'll assume only "Admin" can manage user-role relationships.
 */

// GET all => "Admin"
router.get('/', authMiddleware, roleMiddleware(['Admin']), urController.getAllUserRoles);

// GET by composite key => "Admin"
router.get('/:user_id/:role_id', authMiddleware, roleMiddleware(['Admin']), urController.getUserRole);

// POST create => "Admin"
router.post('/', authMiddleware, roleMiddleware(['Admin']), urController.createUserRole);

// PUT update => "Admin"
router.put('/:user_id/:role_id', authMiddleware, roleMiddleware(['Admin']), urController.updateUserRole);

// DELETE => "Admin"
router.delete('/:user_id/:role_id', authMiddleware, roleMiddleware(['Admin']), urController.deleteUserRole);

module.exports = router;
