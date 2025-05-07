// backend/src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
// Ajusta este require al nombre real de tu fichero:
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
 *       required:
 *         - name
 *         - dni
 *         - password
 *         - role
 *       properties:
 *         name:
 *           type: string
 *           example: John Doe
 *         dni:
 *           type: string
 *           example: 12345678A
 *         email:
 *           type: string
 *           format: email
 *           example: user@example.com
 *         password:
 *           type: string
 *           format: password
 *           example: secret123
 *         role:
 *           type: string
 *           enum: [patient, doctor]
 *           example: doctor
 *         date_of_birth:
 *           type: string
 *           format: date
 *           example: 1980-05-15
 *         contact_info:
 *           type: string
 *           example: "+34 600 123 456"
 *         specialty:
 *           type: string
 *           example: Cardiología
 *         availability:
 *           type: string
 *           example: "Lunes a Viernes 9:00-14:00"
 *     LoginUser:
 *       type: object
 *       required:
 *         - dni
 *         - password
 *       properties:
 *         dni:
 *           type: string
 *           example: 12345678A
 *         password:
 *           type: string
 *           format: password
 *           example: secret123
 *     UserProfile:
 *       type: object
 *       properties:
 *         user_id:
 *           type: integer
 *           example: 7
 *         name:
 *           type: string
 *           example: John Doe
 *         dni:
 *           type: string
 *           example: 12345678A
 *         email:
 *           type: string
 *           format: email
 *           example: user@example.com
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user (Patient or Doctor)
 *     tags: [Auth]
 *     requestBody:
 *       description: New user data, including details and role
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterUser'
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserProfile'
 *       400:
 *         description: Missing required fields or invalid input
 *       409:
 *         description: DNI or email already in use
 *       500:
 *         description: Internal server error
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
 *     responses:
 *       200:
 *         description: Returns a JWT token and user profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 user:
 *                   $ref: '#/components/schemas/UserProfile'
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Internal server error
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
 *         description: Internal server error
 */

// Public endpoints
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected endpoint
router.get('/profile', authMiddleware, authController.getProfile);

module.exports = router;
