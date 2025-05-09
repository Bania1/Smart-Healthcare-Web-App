const express = require('express');
const router = express.Router();
const appointmentsController = require('../controllers/appointmentsController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

/**
 * @swagger
 * tags:
 *   name: Appointments
 *   description: Endpoints for managing appointments
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 *   schemas:
 *     Appointment:
 *       type: object
 *       properties:
 *         date_time:
 *           type: string
 *           format: date-time
 *           example: "2025-01-01T10:00:00Z"
 *         status:
 *           type: string
 *           example: "Scheduled"
 *         doctor_id:
 *           type: integer
 *           example: 7
 *         patient_id:
 *           type: integer
 *           example: 10
 */

/**
 * @swagger
 * /api/appointments:
 *   get:
 *     summary: Retrieve all appointments
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of appointments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Appointment'
 *       401:
 *         description: Missing or invalid token
 *       403:
 *         description: Forbidden (role not allowed)
 *       500:
 *         description: Server error
 *
 *   post:
 *     summary: Create a new appointment
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Appointment data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Appointment'
 *           example:
 *             date_time: "2025-01-01T10:00:00Z"
 *             status: "Scheduled"
 *             doctor_id: 7
 *             patient_id: 10
 *     responses:
 *       201:
 *         description: Appointment created
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Missing or invalid token
 *       403:
 *         description: Forbidden (role not allowed)
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/appointments/{id}:
 *   get:
 *     summary: Get an appointment by ID
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: The ID of the appointment
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: The appointment data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointment'
 *       401:
 *         description: Missing or invalid token
 *       403:
 *         description: Forbidden (role not allowed)
 *       404:
 *         description: Appointment not found
 *       500:
 *         description: Server error
 *
 *   put:
 *     summary: Update an appointment
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: The ID of the appointment
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: Updated appointment data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Appointment'
 *           example:
 *             date_time: "2025-02-10T15:30:00Z"
 *             status: "Updated"
 *             doctor_id: 7
 *             patient_id: 12
 *     responses:
 *       200:
 *         description: Appointment updated
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Missing or invalid token
 *       403:
 *         description: Forbidden (role not allowed)
 *       404:
 *         description: Appointment not found
 *       500:
 *         description: Server error
 *
 *   delete:
 *     summary: Delete an appointment
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: The ID of the appointment
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Appointment deleted
 *       401:
 *         description: Missing or invalid token
 *       403:
 *         description: Forbidden (role not allowed)
 *       404:
 *         description: Appointment not found
 *       500:
 *         description: Server error
 */

/**
 * For demonstration, let's assume:
 * - Only a "Doctor" can GET, POST, or PUT appointments.
 * - Only an "Admin" can also GET, POST, PUT or DELETE appointments.
 */

// GET all appointments => either "Doctor" or "Admin"
router.get('/', authMiddleware, roleMiddleware(['Doctor', 'Admin', 'Patient']), appointmentsController.getAllAppointments);

// GET appointment by ID => "Doctor" or "Admin"
router.get('/:id', authMiddleware, roleMiddleware(['Doctor', 'Admin', 'Patient']), appointmentsController.getAppointmentById);

// POST create => "Doctor" or "Admin"
router.post('/', authMiddleware, roleMiddleware(['Doctor', 'Admin']), appointmentsController.createAppointment);

// PUT update => "Doctor" or "Admin"
router.put('/:id', authMiddleware, roleMiddleware(['Doctor', 'Admin']), appointmentsController.updateAppointment);

// DELETE => let's say only "Admin" can do it
router.delete('/:id', authMiddleware, roleMiddleware(['Admin']), appointmentsController.deleteAppointment);

module.exports = router;
