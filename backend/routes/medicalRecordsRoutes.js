// routes/medicalRecordsRoutes.js
const express = require('express');
const router = express.Router();
const medicalRecordsController = require('../controllers/medicalRecordsController');
// Import your authentication middleware
const authMiddleware = require('../middleware/authMiddleware');

// GET all medical records (protected)
router.get('/', authMiddleware, medicalRecordsController.getAllMedicalRecords);

// GET medical record by ID (protected)
router.get('/:id', authMiddleware, medicalRecordsController.getMedicalRecordById);

// POST create medical record (protected)
router.post('/', authMiddleware, medicalRecordsController.createMedicalRecord);

// PUT update medical record (protected)
router.put('/:id', authMiddleware, medicalRecordsController.updateMedicalRecord);

// DELETE medical record (protected)
router.delete('/:id', authMiddleware, medicalRecordsController.deleteMedicalRecord);

module.exports = router;
