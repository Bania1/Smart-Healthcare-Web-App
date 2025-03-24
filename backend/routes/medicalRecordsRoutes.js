// routes/medicalRecordsRoutes.js
const express = require('express');
const router = express.Router();
const medicalRecordsController = require('../controllers/medicalRecordsController');
// Middlewares
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

/**
 * For demonstration:
 * - "Doctor" or "Admin" can GET, POST, PUT medical records.
 * - Only "Admin" can DELETE.
 */

// GET all medical records => "Doctor" or "Admin"
router.get('/', authMiddleware, roleMiddleware(['Doctor', 'Admin']), medicalRecordsController.getAllMedicalRecords);

// GET a medical record by ID => "Doctor" or "Admin"
router.get('/:id', authMiddleware, roleMiddleware(['Doctor', 'Admin']), medicalRecordsController.getMedicalRecordById);

// POST create medical record => "Doctor" or "Admin"
router.post('/', authMiddleware, roleMiddleware(['Doctor', 'Admin']), medicalRecordsController.createMedicalRecord);

// PUT update medical record => "Doctor" or "Admin"
router.put('/:id', authMiddleware, roleMiddleware(['Doctor', 'Admin']), medicalRecordsController.updateMedicalRecord);

// DELETE medical record => "Admin" only
router.delete('/:id', authMiddleware, roleMiddleware(['Admin']), medicalRecordsController.deleteMedicalRecord);

module.exports = router;
