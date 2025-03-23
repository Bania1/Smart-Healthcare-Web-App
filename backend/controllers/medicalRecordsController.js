// controllers/medicalRecordsController.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * GET /api/medical-records
 * Retrieve all medical records
 */
exports.getAllMedicalRecords = async (req, res) => {
  try {
    const allRecords = await prisma.medical_records.findMany();
    return res.status(200).json(allRecords);
  } catch (error) {
    console.error('Error in getAllMedicalRecords:', error);
    return res.status(500).json({ error: 'Failed to retrieve medical records' });
  }
};

/**
 * GET /api/medical-records/:id
 * Retrieve a medical record by ID
 */
exports.getMedicalRecordById = async (req, res) => {
  try {
    const { id } = req.params;
    const record = await prisma.medical_records.findUnique({
      where: { record_id: Number(id) },
      // If you want to include doctor/patient info, you can do:
      // include: {
      //   users_medical_records_doctor_idTousers: true,
      //   users_medical_records_patient_idTousers: true
      // }
    });

    if (!record) {
      return res.status(404).json({ error: 'Medical record not found' });
    }

    return res.status(200).json(record);
  } catch (error) {
    console.error('Error in getMedicalRecordById:', error);
    return res.status(500).json({ error: 'Failed to retrieve the medical record' });
  }
};

/**
 * POST /api/medical-records
 * Create a new medical record
 */
exports.createMedicalRecord = async (req, res) => {
  try {
    const { date, notes, type, patient_id, doctor_id } = req.body;

    // Basic date parsing if it's a string
    const parsedDate = date ? new Date(date) : null;

    // Optionally, you could validate 'type' or check if 'patient_id'/'doctor_id' exist.
    // For now, let's assume it's valid.

    try {
      const newRecord = await prisma.medical_records.create({
        data: {
          date: parsedDate,
          notes,
          type,
          patient_id,
          doctor_id,
        },
      });

      return res.status(201).json(newRecord);
    } catch (createError) {
      console.error('Error in createMedicalRecord (Prisma):', createError);

      // If there's a foreign key violation (e.g., patient_id or doctor_id not existing), Prisma throws P2003
      if (createError.code === 'P2003') {
        return res.status(400).json({
          error: 'Foreign key violation: patient_id or doctor_id do not exist',
        });
      }
      // If there's a unique constraint violation (less likely here, unless you have constraints)
      if (createError.code === 'P2002') {
        return res.status(409).json({
          error: 'A record with these constraints already exists',
        });
      }
      return res.status(500).json({ error: 'Failed to create the medical record' });
    }
  } catch (error) {
    console.error('Error in createMedicalRecord (general):', error);
    return res.status(500).json({ error: 'Internal error while creating the medical record' });
  }
};

/**
 * PUT /api/medical-records/:id
 * Update a medical record
 */
exports.updateMedicalRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, notes, type, patient_id, doctor_id } = req.body;

    // Check if the record exists
    const existingRecord = await prisma.medical_records.findUnique({
      where: { record_id: Number(id) },
    });
    if (!existingRecord) {
      return res.status(404).json({ error: 'Medical record not found' });
    }

    // Attempt to update
    try {
      const updatedRecord = await prisma.medical_records.update({
        where: { record_id: Number(id) },
        data: {
          date: date ? new Date(date) : existingRecord.date,
          notes: notes ?? existingRecord.notes,
          type: type ?? existingRecord.type,
          patient_id: patient_id ?? existingRecord.patient_id,
          doctor_id: doctor_id ?? existingRecord.doctor_id,
        },
      });

      return res.status(200).json(updatedRecord);
    } catch (updateError) {
      console.error('Error in updateMedicalRecord (Prisma):', updateError);

      if (updateError.code === 'P2003') {
        return res.status(400).json({
          error: 'Foreign key violation: patient_id or doctor_id do not exist',
        });
      }
      if (updateError.code === 'P2002') {
        return res.status(409).json({
          error: 'A record with these constraints already exists',
        });
      }
      return res.status(500).json({ error: 'Failed to update the medical record' });
    }
  } catch (error) {
    console.error('Error in updateMedicalRecord (general):', error);
    return res.status(500).json({ error: 'Internal error while updating the medical record' });
  }
};

/**
 * DELETE /api/medical-records/:id
 * Delete a medical record
 */
exports.deleteMedicalRecord = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if it exists
    const existingRecord = await prisma.medical_records.findUnique({
      where: { record_id: Number(id) },
    });
    if (!existingRecord) {
      return res.status(404).json({ error: 'Medical record not found' });
    }

    await prisma.medical_records.delete({
      where: { record_id: Number(id) },
    });

    return res.status(204).send(); // No Content
  } catch (error) {
    console.error('Error in deleteMedicalRecord:', error);
    return res.status(500).json({ error: 'Failed to delete the medical record' });
  }
};
