const express = require('express');
const router = express.Router();
const rolesController = require('../controllers/rolesController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

/**
 * @swagger
 * tags:
 *   name: Roles
 *   description: Endpoints for managing roles (Admin only)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Role:
 *       type: object
 *       properties:
 *         role_id:
 *           type: integer
 *           example: 1
 *         role_name:
 *           type: string
 *           example: "Admin"
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /api/roles:
 *   get:
 *     summary: Retrieve all roles
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of roles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Role'
 *       401:
 *         description: Missing or invalid token
 *       403:
 *         description: Forbidden (only Admin)
 *       500:
 *         description: Server error
 *
 *   post:
 *     summary: Create a new role
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Role data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Role'
 *           example:
 *             role_name: "Doctor"
 *     responses:
 *       201:
 *         description: Role created
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Missing or invalid token
 *       403:
 *         description: Forbidden (only Admin)
 *       409:
 *         description: Role name already exists
 *       500:
 *         description: Failed to create the role
 */

/**
 * @swagger
 * /api/roles/{id}:
 *   get:
 *     summary: Get a role by ID
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: The ID of the role
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: The role data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Role'
 *       401:
 *         description: Missing or invalid token
 *       403:
 *         description: Forbidden (only Admin)
 *       404:
 *         description: Role not found
 *       500:
 *         description: Server error
 *
 *   put:
 *     summary: Update a role
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: The ID of the role
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: Updated role data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Role'
 *           example:
 *             role_name: "UpdatedRoleName"
 *     responses:
 *       200:
 *         description: Role updated
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Missing or invalid token
 *       403:
 *         description: Forbidden (only Admin)
 *       404:
 *         description: Role not found
 *       500:
 *         description: Failed to update the role
 *
 *   delete:
 *     summary: Delete a role
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: The ID of the role
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Role deleted
 *       401:
 *         description: Missing or invalid token
 *       403:
 *         description: Forbidden (only Admin)
 *       404:
 *         description: Role not found
 *       500:
 *         description: Failed to delete the role
 */

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
