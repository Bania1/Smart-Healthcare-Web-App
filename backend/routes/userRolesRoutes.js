const express = require('express');
const router = express.Router();
const urController = require('../controllers/userRolesController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

/**
 * @swagger
 * tags:
 *   name: UserRoles
 *   description: Endpoints for managing the relationship between users and roles (Admin only)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     UserRole:
 *       type: object
 *       properties:
 *         user_id:
 *           type: integer
 *           example: 5
 *         role_id:
 *           type: integer
 *           example: 2
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /api/user-roles:
 *   get:
 *     summary: List all user-role relationships
 *     tags: [UserRoles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of user-role pairs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserRole'
 *       401:
 *         description: Missing or invalid token
 *       403:
 *         description: Forbidden (only Admin)
 *       500:
 *         description: Server error
 *
 *   post:
 *     summary: Create a new user-role relationship
 *     tags: [UserRoles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: user_id and role_id
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserRole'
 *           example:
 *             user_id: 5
 *             role_id: 2
 *     responses:
 *       201:
 *         description: User-role relationship created
 *       400:
 *         description: Invalid input or foreign key violation
 *       401:
 *         description: Missing or invalid token
 *       403:
 *         description: Forbidden (only Admin)
 *       409:
 *         description: Relationship already exists
 *       500:
 *         description: Failed to create relationship
 */

/**
 * @swagger
 * /api/user-roles/{user_id}/{role_id}:
 *   get:
 *     summary: Get a specific user-role relationship by composite key
 *     tags: [UserRoles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user_id
 *         description: The ID of the user
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: role_id
 *         description: The ID of the role
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: The user-role relationship data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserRole'
 *       401:
 *         description: Missing or invalid token
 *       403:
 *         description: Forbidden (only Admin)
 *       404:
 *         description: Relationship not found
 *       500:
 *         description: Server error
 *
 *   put:
 *     summary: Update a user-role relationship (often delete+create for composite keys)
 *     tags: [UserRoles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user_id
 *         description: The ID of the user
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: role_id
 *         description: The ID of the role
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: New user_id and/or role_id for the updated relationship
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserRole'
 *           example:
 *             user_id: 5
 *             role_id: 3
 *     responses:
 *       200:
 *         description: Relationship updated
 *       400:
 *         description: Invalid input or foreign key violation
 *       401:
 *         description: Missing or invalid token
 *       403:
 *         description: Forbidden (only Admin)
 *       404:
 *         description: Relationship not found
 *       409:
 *         description: The new relationship already exists
 *       500:
 *         description: Failed to update relationship
 *
 *   delete:
 *     summary: Delete a specific user-role relationship
 *     tags: [UserRoles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user_id
 *         description: The ID of the user
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: role_id
 *         description: The ID of the role
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Relationship deleted
 *       401:
 *         description: Missing or invalid token
 *       403:
 *         description: Forbidden (only Admin)
 *       404:
 *         description: Relationship not found
 *       500:
 *         description: Failed to delete relationship
 */

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
