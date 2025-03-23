// routes/usersDetailsRoutes.js
const express = require('express');
const router = express.Router();
const detailsController = require('../controllers/usersDetailsController');
// Import your authentication middleware
const authMiddleware = require('../middleware/authMiddleware');

// GET all users_details (protected)
router.get('/', authMiddleware, detailsController.getAllUsersDetails);

// GET one by user_id (protected)
router.get('/:user_id', authMiddleware, detailsController.getUserDetailsById);

// POST create (protected)
router.post('/', authMiddleware, detailsController.createUserDetails);

// PUT update (protected)
router.put('/:user_id', authMiddleware, detailsController.updateUserDetails);

// DELETE remove (protected)
router.delete('/:user_id', authMiddleware, detailsController.deleteUserDetails);

module.exports = router;
