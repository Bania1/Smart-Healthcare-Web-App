const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Endpoints for managing users (Admin only)
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
 *           example: "admin@example.com"
 *         name:
 *           type: string
 *           example: "Administrator"
 *         password:
 *           type: string
 *           format: password
 *           example: "secret123"
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: Missing or invalid token
 *       403:
 *         description: Forbidden (only Admin)
 *       500:
 *         description: Server error
 *
 *   post:
 *     summary: Create a new user (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: User data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *           example:
 *             email: "newuser@example.com"
 *             password: "password123"
 *             name: "New User"
 *     responses:
 *       201:
 *         description: User created
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Missing or invalid token
 *       403:
 *         description: Forbidden (only Admin)
 *       409:
 *         description: Email already in use
 *       500:
 *         description: Failed to create user
 */

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get a user by ID (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: The ID of the user
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: The user data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Missing or invalid token
 *       403:
 *         description: Forbidden (only Admin)
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 *
 *   put:
 *     summary: Update a user (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: The ID of the user
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: Updated user data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *           example:
 *             email: "updateduser@example.com"
 *             password: "newSecret123"
 *             name: "Updated Name"
 *     responses:
 *       200:
 *         description: User updated
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Missing or invalid token
 *       403:
 *         description: Forbidden (only Admin)
 *       404:
 *         description: User not found
 *       409:
 *         description: Email already in use
 *       500:
 *         description: Failed to update user
 *
 *   delete:
 *     summary: Delete a user (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: The ID of the user
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: User deleted
 *       401:
 *         description: Missing or invalid token
 *       403:
 *         description: Forbidden (only Admin)
 *       404:
 *         description: User not found
 *       500:
 *         description: Failed to delete user
 */

/**
 * Only Admin can do anything with users
 */
router.get('/', authMiddleware, roleMiddleware(['Admin']), usersController.getAllUsers);
router.get('/:id', authMiddleware, roleMiddleware(['Admin']), usersController.getUserById);
router.post('/', authMiddleware, roleMiddleware(['Admin']), usersController.createUser);
router.put('/:id', authMiddleware, roleMiddleware(['Admin']), usersController.updateUser);
router.delete('/:id', authMiddleware, roleMiddleware(['Admin']), usersController.deleteUser);

module.exports = router;
