// backend/src/routes/usersRoutes.js
const express         = require('express');
const router          = express.Router();
const usersController = require('../controllers/usersController');
const authMiddleware  = require('../middleware/authMiddleware');
const authorizeRoles  = require('../middleware/roleMiddleware');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Endpoints for managing users
 */

/**
 * GET /api/users
 *   — Doctor or Admin can list all users
 */
router.get(
  '/',
  authMiddleware,
  authorizeRoles(['Doctor','Admin']),
  usersController.getAllUsers
);

/**
 * GET /api/users/search
 *   — Doctor, Admin or Patient can search for doctors
 */
router.get(
  '/search',
  authMiddleware,
  // pass each role as its own argument, not an array
  authorizeRoles('Doctor', 'Admin', 'Patient'),
  usersController.searchUsers
);

/**
 * GET /api/users/:id
 *   — Admin only
 */
router.get(
  '/:id',
  authMiddleware,
  authorizeRoles(['Admin']),
  usersController.getUserById
);

/**
 * POST /api/users
 *   — Admin only
 */
router.post(
  '/',
  authMiddleware,
  authorizeRoles(['Admin']),
  usersController.createUser
);

/**
 * PUT /api/users/:id
 *   — Admin only
 */
router.put(
  '/:id',
  authMiddleware,
  authorizeRoles(['Admin']),
  usersController.updateUser
);

/**
 * DELETE /api/users/:id
 *   — Admin only
 */
router.delete(
  '/:id',
  authMiddleware,
  authorizeRoles(['Admin']),
  usersController.deleteUser
);

module.exports = router;
