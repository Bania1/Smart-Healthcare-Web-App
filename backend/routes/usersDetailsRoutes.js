const express = require('express');
const router = express.Router();
const detailsController = require('../controllers/usersDetailsController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

/**
 * @swagger
 * tags:
 *   name: UsersDetails
 *   description: Endpoints for managing user details
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     UserDetails:
 *       type: object
 *       properties:
 *         user_id:
 *           type: integer
 *           example: 5
 *         specialty:
 *           type: string
 *           example: "Cardiology"
 *         availability:
 *           type: string
 *           example: "Weekdays 9am-5pm"
 *         date_of_birth:
 *           type: string
 *           format: date
 *           example: "1985-07-21"
 *         contact_info:
 *           type: string
 *           example: "user@example.com"
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /api/users-details:
 *   get:
 *     summary: Retrieve all user details (Admin only)
 *     tags: [UsersDetails]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of all users' details
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserDetails'
 *       401:
 *         description: Missing or invalid token
 *       403:
 *         description: Forbidden (only Admin)
 *       500:
 *         description: Server error
 *
 *   post:
 *     summary: Create a new user details record (Admin or the user themself)
 *     tags: [UsersDetails]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: User details data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserDetails'
 *           example:
 *             user_id: 10
 *             specialty: "Pediatrics"
 *             availability: "Mon-Fri 8am-2pm"
 *             date_of_birth: "1990-05-15"
 *             contact_info: "doctor@example.com"
 *     responses:
 *       201:
 *         description: User details record created
 *       400:
 *         description: Invalid input or user_id already has details
 *       401:
 *         description: Missing or invalid token
 *       403:
 *         description: Forbidden (Admin or user themself)
 *       500:
 *         description: Failed to create user details
 */

/**
 * @swagger
 * /api/users-details/{user_id}:
 *   get:
 *     summary: Get details of a specific user (Admin or the user themself)
 *     tags: [UsersDetails]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user_id
 *         description: The ID of the user
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: The user's details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserDetails'
 *       401:
 *         description: Missing or invalid token
 *       403:
 *         description: Forbidden (Admin or user themself)
 *       404:
 *         description: Details not found for that user_id
 *       500:
 *         description: Server error
 *
 *   put:
 *     summary: Update details for a specific user (Admin or the user themself)
 *     tags: [UsersDetails]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user_id
 *         description: The ID of the user
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: Updated user details
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserDetails'
 *           example:
 *             specialty: "Neurology"
 *             availability: "Weekdays 9am-1pm"
 *             date_of_birth: "1992-10-01"
 *             contact_info: "user_updated@example.com"
 *     responses:
 *       200:
 *         description: User details updated
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Missing or invalid token
 *       403:
 *         description: Forbidden (Admin or user themself)
 *       404:
 *         description: Details not found for that user_id
 *       500:
 *         description: Failed to update user details
 *
 *   delete:
 *     summary: Delete user details for a specific user (Admin or the user themself)
 *     tags: [UsersDetails]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user_id
 *         description: The ID of the user
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: User details deleted
 *       401:
 *         description: Missing or invalid token
 *       403:
 *         description: Forbidden (Admin or user themself)
 *       404:
 *         description: Details not found for that user_id
 *       500:
 *         description: Failed to delete user details
 */

/**
 * Example logic:
 * 1) Only "Admin" can GET all users_details (to see everyone's details).
 * 2) For a single user’s details:
 *    - Either "Admin" can see/update/delete any user_id,
 *    - Or the user can see/update/delete their own user_id.
 * 3) For POST (create user details), either the user themselves or "Admin" can do it.
 */

// GET all => Only "Admin"
router.get('/', authMiddleware, roleMiddleware(['Admin']), detailsController.getAllUsersDetails);

// GET one by user_id => Admin or the user themself
router.get('/:user_id', authMiddleware, detailsController.getUserDetailsById);

// POST create => Admin or the user themself
router.post('/', authMiddleware, detailsController.createUserDetails);

// PUT => Admin or the user themself
router.put('/:user_id', authMiddleware, detailsController.updateUserDetails);

// DELETE => Admin or the user themself
router.delete('/:user_id', authMiddleware, detailsController.deleteUserDetails);

module.exports = router;
