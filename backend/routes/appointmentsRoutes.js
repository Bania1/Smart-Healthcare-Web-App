// routes/appointmentsRoutes.js
const express = require('express');
const router = express.Router();
const appointmentsController = require('../controllers/appointmentsController');

// GET all appointments
router.get('/', appointmentsController.getAllAppointments);

// GET appointment by ID
router.get('/:id', appointmentsController.getAppointmentById);

// POST create appointment
router.post('/', appointmentsController.createAppointment);

// PUT update appointment
router.put('/:id', appointmentsController.updateAppointment);

// DELETE appointment
router.delete('/:id', appointmentsController.deleteAppointment);

module.exports = router;
