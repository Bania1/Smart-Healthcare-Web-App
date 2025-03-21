// routes/usersDetailsRoutes.js
const express = require('express');
const router = express.Router();
const detailsController = require('../controllers/usersDetailsController');

// GET all users_details
router.get('/', detailsController.getAllUsersDetails);

// GET one by user_id
router.get('/:user_id', detailsController.getUserDetailsById);

// POST create
router.post('/', detailsController.createUserDetails);

// PUT update
router.put('/:user_id', detailsController.updateUserDetails);

// DELETE remove
router.delete('/:user_id', detailsController.deleteUserDetails);

module.exports = router;
