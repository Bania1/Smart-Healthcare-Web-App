// routes/medicalRecordsRoutes.js
const express = require('express');
const router = express.Router();
const medicalRecordsController = require('../controllers/medicalRecordsController');

// GET all medical records
router.get('/', medicalRecordsController.getAllMedicalRecords);

// GET medical record by ID
router.get('/:id', medicalRecordsController.getMedicalRecordById);

// POST create medical record
router.post('/', medicalRecordsController.createMedicalRecord);

// PUT update medical record
router.put('/:id', medicalRecordsController.updateMedicalRecord);

// DELETE medical record
router.delete('/:id', medicalRecordsController.deleteMedicalRecord);

module.exports = router;