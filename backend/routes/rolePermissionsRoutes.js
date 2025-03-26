const express = require('express');
const router = express.Router();
const rpController = require('../controllers/rolePermissionsController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

/**
 * @swagger
 * tags:
 *   name: RolePermissions
 *   description: Endpoints for managing the relationship between roles and permissions (Admin only)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     RolePermission:
 *       type: object
 *       properties:
 *         role_id:
 *           type: integer
 *           example: 1
 *         permission_id:
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
 * /api/role-permissions:
 *   get:
 *     summary: List all role-permission relationships
 *     tags: [RolePermissions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of role-permission pairs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/RolePermission'
 *       401:
 *         description: Missing or invalid token
 *       403:
 *         description: Forbidden (only Admin)
 *       500:
 *         description: Server error
 *
 *   post:
 *     summary: Create a new role-permission relationship
 *     tags: [RolePermissions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: role_id and permission_id
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RolePermission'
 *           example:
 *             role_id: 1
 *             permission_id: 2
 *     responses:
 *       201:
 *         description: Role-permission relationship created
 *       400:
 *         description: Invalid input
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
 * /api/role-permissions/{role_id}/{permission_id}:
 *   get:
 *     summary: Get a specific role-permission relationship by composite key
 *     tags: [RolePermissions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: role_id
 *         description: The ID of the role
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: permission_id
 *         description: The ID of the permission
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: The role-permission relationship data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RolePermission'
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
 *     summary: Update a role-permission relationship (typically a delete+create approach)
 *     tags: [RolePermissions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: role_id
 *         description: The ID of the role
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: permission_id
 *         description: The ID of the permission
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: New role_id and/or permission_id for the updated relationship
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RolePermission'
 *           example:
 *             role_id: 2
 *             permission_id: 3
 *     responses:
 *       200:
 *         description: Relationship updated
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Missing or invalid token
 *       403:
 *         description: Forbidden (only Admin)
 *       409:
 *         description: The new relationship already exists
 *       500:
 *         description: Failed to update relationship
 *
 *   delete:
 *     summary: Delete a specific role-permission relationship
 *     tags: [RolePermissions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: role_id
 *         description: The ID of the role
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: permission_id
 *         description: The ID of the permission
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
 * We'll assume only "Admin" can manage role-permissions.
 */

// GET all => "Admin"
router.get('/', authMiddleware, roleMiddleware(['Admin']), rpController.getAllRolePermissions);

// GET by composite key => "Admin"
router.get('/:role_id/:permission_id', authMiddleware, roleMiddleware(['Admin']), rpController.getRolePermission);

// POST create => "Admin"
router.post('/', authMiddleware, roleMiddleware(['Admin']), rpController.createRolePermission);

// PUT update => "Admin"
router.put('/:role_id/:permission_id', authMiddleware, roleMiddleware(['Admin']), rpController.updateRolePermission);

// DELETE => "Admin"
router.delete('/:role_id/:permission_id', authMiddleware, roleMiddleware(['Admin']), rpController.deleteRolePermission);

module.exports = router;
