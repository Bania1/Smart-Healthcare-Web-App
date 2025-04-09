const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Endpoints for user authentication and profile management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     RegisterUser:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: user@example.com
 *         password:
 *           type: string
 *           format: password
 *           example: secret123
 *         name:
 *           type: string
 *           example: John Doe
 *
 *     LoginUser:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: user@example.com
 *         password:
 *           type: string
 *           format: password
 *           example: secret123
 *
 *     UserProfile:
 *       type: object
 *       properties:
 *         user_id:
 *           type: integer
 *           example: 7
 *         name:
 *           type: string
 *           example: John Doe
 *         email:
 *           type: string
 *           format: email
 *           example: user@example.com
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       description: New user data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterUser'
 *           example:
 *             email: "newuser@example.com"
 *             password: "secret123"
 *             name: "New User"
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Missing required fields or invalid input
 *       409:
 *         description: Email already in use
 *       500:
 *         description: Failed to register user
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login and obtain a JWT token
 *     tags: [Auth]
 *     requestBody:
 *       description: User credentials
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginUser'
 *           example:
 *             email: "user@example.com"
 *             password: "secret123"
 *     responses:
 *       200:
 *         description: Returns a JWT token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Failed to login
 */

/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     summary: Get the current user's profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns the authenticated user's profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserProfile'
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       404:
 *         description: User not found
 *       500:
 *         description: Failed to retrieve profile
 */

// Register and login (public endpoints)
router.post('/register', authController.register);
router.post('/login', authController.login);

// Profile (protected endpoint)
router.get('/profile', authMiddleware, authController.getProfile);

module.exports = router;
