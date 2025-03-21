// controllers/medicalRecordsController.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * GET /api/medical-records
 * Obtener todos los registros médicos
 */
exports.getAllMedicalRecords = async (req, res) => {
  try {
    const allRecords = await prisma.medical_records.findMany();
    return res.status(200).json(allRecords);
  } catch (error) {
    console.error('Error en getAllMedicalRecords:', error);
    return res.status(500).json({ error: 'Error al obtener los registros médicos' });
  }
};

/**
 * GET /api/medical-records/:id
 * Obtener un registro médico por ID
 */
exports.getMedicalRecordById = async (req, res) => {
  try {
    const { id } = req.params;
    const record = await prisma.medical_records.findUnique({
      where: { record_id: Number(id) },
      // Si quieres incluir info del doctor/paciente:
      // include: {
      //   users_medical_records_doctor_idTousers: true,
      //   users_medical_records_patient_idTousers: true
      // }
    });

    if (!record) {
      return res.status(404).json({ error: 'Registro médico no encontrado' });
    }

    return res.status(200).json(record);
  } catch (error) {
    console.error('Error en getMedicalRecordById:', error);
    return res.status(500).json({ error: 'Error al obtener el registro médico' });
  }
};

/**
 * POST /api/medical-records
 * Crear un nuevo registro médico
 */
exports.createMedicalRecord = async (req, res) => {
  try {
    const { date, notes, type, patient_id, doctor_id } = req.body;

    // Parseamos la fecha si viene como string
    const parsedDate = date ? new Date(date) : null;

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
  } catch (error) {
    console.error('Error en createMedicalRecord:', error);
    return res.status(500).json({ error: 'Error al crear el registro médico' });
  }
};

/**
 * PUT /api/medical-records/:id
 * Actualizar un registro médico
 */
exports.updateMedicalRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, notes, type, patient_id, doctor_id } = req.body;

    // Verificamos si existe
    const existingRecord = await prisma.medical_records.findUnique({
      where: { record_id: Number(id) },
    });
    if (!existingRecord) {
      return res.status(404).json({ error: 'Registro médico no encontrado' });
    }

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
  } catch (error) {
    console.error('Error en updateMedicalRecord:', error);
    return res.status(500).json({ error: 'Error al actualizar el registro médico' });
  }
};

/**
 * DELETE /api/medical-records/:id
 * Eliminar un registro médico
 */
exports.deleteMedicalRecord = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificamos si existe
    const existingRecord = await prisma.medical_records.findUnique({
      where: { record_id: Number(id) },
    });
    if (!existingRecord) {
      return res.status(404).json({ error: 'Registro médico no encontrado' });
    }

    await prisma.medical_records.delete({
      where: { record_id: Number(id) },
    });

    return res.status(204).send(); // No Content
  } catch (error) {
    console.error('Error en deleteMedicalRecord:', error);
    return res.status(500).json({ error: 'Error al eliminar el registro médico' });
  }
};
