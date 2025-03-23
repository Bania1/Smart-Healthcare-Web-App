// routes/appointmentsRoutes.js
const express = require('express');
const router = express.Router();
const appointmentsController = require('../controllers/appointmentsController');
// Import your authentication middleware
const authMiddleware = require('../middleware/authMiddleware');

// GET all appointments (protected)
router.get('/', authMiddleware, appointmentsController.getAllAppointments);

// GET appointment by ID (protected)
router.get('/:id', authMiddleware, appointmentsController.getAppointmentById);

// POST create appointment (protected)
router.post('/', authMiddleware, appointmentsController.createAppointment);

// PUT update appointment (protected)
router.put('/:id', authMiddleware, appointmentsController.updateAppointment);

// DELETE appointment (protected)
router.delete('/:id', authMiddleware, appointmentsController.deleteAppointment);

module.exports = router;
