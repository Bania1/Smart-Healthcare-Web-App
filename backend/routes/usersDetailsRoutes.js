// routes/usersDetailsRoutes.js
const express = require('express');
const router = express.Router();
const detailsController = require('../controllers/usersDetailsController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

/**
 * Example logic:
 * 1) Only "Admin" can GET all users_details (to see everyone's details).
 * 2) For a single user’s details:
 *    - Either "Admin" can see/update/delete any user_id,
 *    - Or the user can see/update/delete their own user_id.
 *    (This part might need custom checks in the controller, e.g., if (req.user.userId === user_idParam).)
 * 3) For POST (create user details), either the user themselves or "Admin" can do it.
 */

// GET all => Only "Admin"
router.get('/', authMiddleware, roleMiddleware(['Admin']), detailsController.getAllUsersDetails);

// GET one by user_id => "Admin" or the user themself
router.get('/:user_id', authMiddleware, detailsController.getUserDetailsById);

// POST create => "Admin" or the user themself
router.post('/', authMiddleware, detailsController.createUserDetails);

// PUT => "Admin" or the user themself
router.put('/:user_id', authMiddleware, detailsController.updateUserDetails);

// DELETE => "Admin" or the user themself
router.delete('/:user_id', authMiddleware, detailsController.deleteUserDetails);

module.exports = router;
