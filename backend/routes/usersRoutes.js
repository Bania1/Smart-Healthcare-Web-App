// backend/src/routes/usersRoutes.js
const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const authMiddleware = require('../middleware/authMiddleware');
// Importa tu middleware de roles con el nombre correcto:
const authorizeRoles = require('../middleware/roleMiddleware');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Endpoints for managing users (Doctor or Admin)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         user_id:
 *           type: integer
 *           example: 1
 *         email:
 *           type: string
 *           format: email
 *           example: "user@example.com"
 *         name:
 *           type: string
 *           example: "John Doe"
 */

/**
 * GET /api/users
 *   - Doctor o Admin pueden listar todos los usuarios
 */
router.get(
    '/',
    authMiddleware,
    authorizeRoles('Doctor', 'Admin'),
    usersController.getAllUsers
  );
  
  /**
   * GET /api/users/:id       — Solo Admin
   */
  router.get(
    '/:id',
    authMiddleware,
    authorizeRoles('Admin'),
    usersController.getUserById
  );
  
  /**
   * POST /api/users          — Solo Admin
   */
  router.post(
    '/',
    authMiddleware,
    authorizeRoles('Admin'),
    usersController.createUser
  );
  
  /**
   * PUT /api/users/:id       — Solo Admin
   */
  router.put(
    '/:id',
    authMiddleware,
    authorizeRoles('Admin'),
    usersController.updateUser
  );
  
  /**
   * DELETE /api/users/:id    — Solo Admin
   */
  router.delete(
    '/:id',
    authMiddleware,
    authorizeRoles('Admin'),
    usersController.deleteUser
  );
  
  module.exports = router;

   /**
   * Get con search 
   */
  router.get(
    '/search',
    authMiddleware,
    authorizeRoles(['Doctor','Admin']),
    usersController.searchUsers
  );
