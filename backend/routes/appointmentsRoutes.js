// routes/appointmentsRoutes.js
const express = require('express');
const router = express.Router();
const appointmentsController = require('../controllers/appointmentsController');
// Middlewares
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

/**
 * For demonstration, let's assume:
 * - Only a "Doctor" can GET, POST, or PUT appointments.
 * - Only an "Admin" can also GET ,POST, PUT or DELETE appointments.
 */


// GET all appointments => either "Doctor" or "Admin" can do it
router.get('/', authMiddleware, roleMiddleware(['Doctor', 'Admin']), appointmentsController.getAllAppointments);

// GET appointment by ID => "Doctor" or "Admin"
router.get('/:id', authMiddleware, roleMiddleware(['Doctor', 'Admin']), appointmentsController.getAppointmentById);

// POST create => "Doctor" or "Admin"
router.post('/', authMiddleware, roleMiddleware(['Doctor', 'Admin']), appointmentsController.createAppointment);

// PUT update => "Doctor" or "Admin"
router.put('/:id', authMiddleware, roleMiddleware(['Doctor', 'Admin']), appointmentsController.updateAppointment);

// DELETE => let's say only "Admin" can do it
router.delete('/:id', authMiddleware, roleMiddleware(['Admin']), appointmentsController.deleteAppointment);

module.exports = router;
