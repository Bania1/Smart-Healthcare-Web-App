// routes/userRolesRoutes.js
const express = require('express');
const router = express.Router();
const urController = require('../controllers/userRolesController');

// GET all
router.get('/', urController.getAllUserRoles);

// GET by composite key
router.get('/:user_id/:role_id', urController.getUserRole);

// POST create
router.post('/', urController.createUserRole);

// PUT update
router.put('/:user_id/:role_id', urController.updateUserRole);

// DELETE
router.delete('/:user_id/:role_id', urController.deleteUserRole);

module.exports = router;
