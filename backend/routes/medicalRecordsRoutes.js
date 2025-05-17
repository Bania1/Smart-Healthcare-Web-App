// backend/src/routes/medicalRecordsRoutes.js
const express                     = require('express');
const router                      = express.Router();
const medicalRecordsController    = require('../controllers/medicalRecordsController');
const authMiddleware              = require('../middleware/authMiddleware');
const roleMiddleware              = require('../middleware/roleMiddleware');

/**
 * @swagger
 * tags:
 *   name: MedicalRecords
 *   description: Endpoints for managing medical records
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     MedicalRecord:
 *       type: object
 *       properties:
 *         date:
 *           type: string
 *           format: date
 *           example: "2025-03-26"
 *         notes:
 *           type: string
 *           example: "Patient is stable"
 *         type:
 *           type: string
 *           example: "Consultation"
 *         patient_id:
 *           type: integer
 *           example: 10
 *         doctor_id:
 *           type: integer
 *           example: 7
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /api/medical-records:
 *   get:
 *     summary: Retrieve all medical records
 *     tags: [MedicalRecords]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of medical records
 *       401:
 *         description: Missing or invalid token
 *       403:
 *         description: Forbidden (role not allowed)
 *       500:
 *         description: Server error
 *   post:
 *     summary: Create a new medical record
 *     tags: [MedicalRecords]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Medical record data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MedicalRecord'
 *     responses:
 *       201:
 *         description: Medical record created
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
 * /api/medical-records/{id}:
 *   get:
 *     summary: Get a medical record by ID
 *     tags: [MedicalRecords]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: The medical record data
 *       401:
 *         description: Missing or invalid token
 *       403:
 *         description: Forbidden (role not allowed)
 *       404:
 *         description: Medical record not found
 *       500:
 *         description: Server error
 *   put:
 *     summary: Update a medical record
 *     tags: [MedicalRecords]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: Updated medical record data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MedicalRecord'
 *     responses:
 *       200:
 *         description: Medical record updated
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Missing or invalid token
 *       403:
 *         description: Forbidden (role not allowed)
 *       404:
 *         description: Medical record not found
 *       500:
 *         description: Server error
 *   delete:
 *     summary: Delete a medical record
 *     tags: [MedicalRecords]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Medical record deleted
 *       401:
 *         description: Missing or invalid token
 *       403:
 *         description: Forbidden (role not allowed)
 *       404:
 *         description: Medical record not found
 *       500:
 *         description: Server error
 */

/**
 * For demonstration:
 * - "Doctor" or "Admin" can GET, POST, PUT medical records.
 * - Only "Admin" can DELETE.
 */

// GET all medical records ⇒ Doctor, Admin or Patient
router.get(
  '/',
  authMiddleware,
  roleMiddleware('Doctor', 'Admin', 'Patient'),
  medicalRecordsController.getAllMedicalRecords
);

// GET a medical record by ID ⇒ Doctor, Admin or Patient
router.get(
  '/:id',
  authMiddleware,
  roleMiddleware('Doctor', 'Admin', 'Patient'),
  medicalRecordsController.getMedicalRecordById
);

// POST create medical record ⇒ Doctor or Admin
router.post(
  '/',
  authMiddleware,
  roleMiddleware('Doctor', 'Admin'),
  medicalRecordsController.createMedicalRecord
);

// PUT update medical record ⇒ Doctor or Admin
router.put(
  '/:id',
  authMiddleware,
  roleMiddleware('Doctor', 'Admin'),
  medicalRecordsController.updateMedicalRecord
);

// DELETE medical record ⇒ Admin only
router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware('Admin'),
  medicalRecordsController.deleteMedicalRecord
);

module.exports = router;
