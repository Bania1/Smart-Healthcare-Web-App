// backend/src/routes/appointmentsRoutes.js
const express = require('express');
const router = express.Router();
const appointmentsController = require('../controllers/appointmentsController');
const authMiddleware = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');

/**
 * @swagger
 * tags:
 *   name: Appointments
 *   description: Endpoints for managing appointments
 */

/**
 * GET /api/appointments
 *   — Doctor, Admin or Patient can list appointments
 */
router.get(
  '/',
  authMiddleware,
  authorizeRoles(['Doctor', 'Admin', 'Patient']),
  appointmentsController.getAllAppointments
);

/**
 * GET /api/appointments/:id
 *   — Doctor, Admin or Patient can view a single appointment
 */
router.get(
  '/',
  authMiddleware,
  authorizeRoles('Doctor', 'Admin', 'Patient'),
  appointmentsController.getAllAppointments
);

/**
 * POST /api/appointments
 *   — Doctor, Admin or Patient can create (Patient = “Pedir cita”)
 */
router.post(
  '/',
  authMiddleware,
  authorizeRoles(['Doctor', 'Admin', 'Patient']),
  appointmentsController.createAppointment
);

/**
 * PUT /api/appointments/:id
 *   — Doctor or Admin only
 */
router.put(
  '/:id',
  authMiddleware,
  authorizeRoles(['Doctor', 'Admin']),
  appointmentsController.updateAppointment
);

/**
 * DELETE /api/appointments/:id
 *   — Admin only
 */
router.delete(
  '/:id',
  authMiddleware,
  authorizeRoles(['Admin']),
  appointmentsController.deleteAppointment
);

module.exports = router;
