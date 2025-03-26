const express = require('express');
const router = express.Router();
const permissionsController = require('../controllers/permissionsController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

/**
 * @swagger
 * tags:
 *   name: Permissions
 *   description: Endpoints for managing permissions (Admin only)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Permission:
 *       type: object
 *       properties:
 *         permission_id:
 *           type: integer
 *           example: 1
 *         permission_name:
 *           type: string
 *           example: "VIEW_DASHBOARD"
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /api/permissions:
 *   get:
 *     summary: Get all permissions
 *     tags: [Permissions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of permissions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Permission'
 *       401:
 *         description: Missing or invalid token
 *       403:
 *         description: Forbidden (only Admin)
 *       500:
 *         description: Server error
 *   post:
 *     summary: Create a new permission
 *     tags: [Permissions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Permission data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Permission'
 *           example:
 *             permission_name: "CREATE_USER"
 *     responses:
 *       201:
 *         description: Permission created
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Missing or invalid token
 *       403:
 *         description: Forbidden (only Admin)
 *       409:
 *         description: Permission name already exists
 *       500:
 *         description: Failed to create permission
 */

/**
 * @swagger
 * /api/permissions/{id}:
 *   get:
 *     summary: Get a permission by ID
 *     tags: [Permissions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: The ID of the permission
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: The permission data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Permission'
 *       401:
 *         description: Missing or invalid token
 *       403:
 *         description: Forbidden (only Admin)
 *       404:
 *         description: Permission not found
 *       500:
 *         description: Server error
 *
 *   put:
 *     summary: Update a permission
 *     tags: [Permissions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: The ID of the permission
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: Updated permission data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Permission'
 *           example:
 *             permission_name: "UPDATED_PERMISSION"
 *     responses:
 *       200:
 *         description: Permission updated
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Missing or invalid token
 *       403:
 *         description: Forbidden (only Admin)
 *       404:
 *         description: Permission not found
 *       500:
 *         description: Server error
 *
 *   delete:
 *     summary: Delete a permission
 *     tags: [Permissions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: The ID of the permission
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Permission deleted
 *       401:
 *         description: Missing or invalid token
 *       403:
 *         description: Forbidden (only Admin)
 *       404:
 *         description: Permission not found
 *       500:
 *         description: Server error
 */

/**
 * Only an "Admin" can get, create, update, or delete permissions.
 */

// GET all permissions => "Admin"
router.get('/', authMiddleware, roleMiddleware(['Admin']), permissionsController.getAllPermissions);

// GET permission by ID => "Admin"
router.get('/:id', authMiddleware, roleMiddleware(['Admin']), permissionsController.getPermissionById);

// POST create permission => "Admin"
router.post('/', authMiddleware, roleMiddleware(['Admin']), permissionsController.createPermission);

// PUT update permission => "Admin"
router.put('/:id', authMiddleware, roleMiddleware(['Admin']), permissionsController.updatePermission);

// DELETE permission => "Admin"
router.delete('/:id', authMiddleware, roleMiddleware(['Admin']), permissionsController.deletePermission);

module.exports = router;
