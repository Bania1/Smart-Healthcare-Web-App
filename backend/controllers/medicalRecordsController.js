// controllers/medicalRecordsController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Campos a incluir en relaciones para no repetir código
 */
const recordInclude = {
  users_medical_records_patient_idTousers: {
    select: { user_id: true, name: true }
  },
  users_medical_records_doctor_idTousers: {
    select: { user_id: true, name: true }
  }
};

/**
 * GET /api/medical-records
 * Listado de todos los historiales (con paciente y médico)
 */
// exports.getAllMedicalRecords
exports.getAllMedicalRecords = async (req, res) => {
  try {
    const where = {};
    if (req.user.roles.includes('Patient')) {
      where.patient_id = req.user.userId;
    }
    const records = await prisma.medical_records.findMany({
      where,
      include: {
        users_medical_records_patient_idTousers: { select: { user_id:true, name:true } },
        users_medical_records_doctor_idTousers:  { select: { user_id:true, name:true } },
      },
      orderBy: { record_id: 'desc' }
    });
    return res.status(200).json(records);
  } catch (error) {
    console.error('Error in getAllMedicalRecords:', error);
    return res.status(500).json({ error: 'Failed to retrieve medical records' });
  }
};

// exports.getMedicalRecordById
exports.getMedicalRecordById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const record = await prisma.medical_records.findUnique({
      where: { record_id: id },
      include: {
        users_medical_records_patient_idTousers: { select: { user_id:true, name:true } },
        users_medical_records_doctor_idTousers:  { select: { user_id:true, name:true } },
      }
    });
    if (!record) return res.status(404).json({ error: 'Medical record not found' });
    if (req.user.roles.includes('Patient') && record.patient_id !== req.user.userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    return res.status(200).json(record);
  } catch (error) {
    console.error('Error in getMedicalRecordById:', error);
    return res.status(500).json({ error: 'Failed to retrieve medical record' });
  }
};

/**
 * POST /api/medical-records
 * Crea un nuevo historial
 */
exports.createMedicalRecord = async (req, res) => {
  try {
    const {
      patient_id,
      doctor_id,
      date,         // YYYY-MM-DD
      time,         // HH:MM
      type,
      diagnostic,
      treatment
    } = req.body;

    // Validación mínima
    if (!patient_id || !doctor_id || !date || !time || !type) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Parseo de fecha y hora
    const dateObj = new Date(date);
    const timeObj = new Date(`1970-01-01T${time}:00`);

    if (isNaN(dateObj) || isNaN(timeObj)) {
      return res.status(400).json({ error: 'Invalid date or time format' });
    }

    const newRecord = await prisma.medical_records.create({
      data: {
        patient_id: Number(patient_id),
        doctor_id:  Number(doctor_id),
        date:       dateObj,
        time:       timeObj,
        type,
        diagnostic: diagnostic || null,
        treatment:  treatment  || null
      },
      include: recordInclude
    });

    return res.status(201).json(newRecord);
  } catch (error) {
    console.error('Error in createMedicalRecord:', error);
    if (error.code === 'P2003') {
      return res.status(400).json({
        error: 'Foreign key violation: patient_id or doctor_id do not exist'
      });
    }
    return res.status(500).json({ error: 'Failed to create medical record' });
  }
};

/**
 * PUT /api/medical-records/:id
 * Actualiza un historial existente
 */
exports.updateMedicalRecord = async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid record ID' });
  }

  try {
    const existing = await prisma.medical_records.findUnique({
      where: { record_id: id }
    });
    if (!existing) {
      return res.status(404).json({ error: 'Medical record not found' });
    }

    const {
      patient_id,
      doctor_id,
      date,
      time,
      type,
      diagnostic,
      treatment
    } = req.body;

    // Sólo parseamos si vienen; si no, mantenemos el existente
    const dateObj = date ? new Date(date) : existing.date;
    const timeObj = time ? new Date(`1970-01-01T${time}:00`) : existing.time;

    if ((date && isNaN(dateObj)) || (time && isNaN(timeObj))) {
      return res.status(400).json({ error: 'Invalid date or time format' });
    }

    const updated = await prisma.medical_records.update({
      where: { record_id: id },
      data: {
        patient_id: Number(patient_id) || existing.patient_id,
        doctor_id:  Number(doctor_id)  || existing.doctor_id,
        date:       dateObj,
        time:       timeObj,
        type:       type        || existing.type,
        diagnostic: diagnostic || existing.diagnostic,
        treatment:  treatment   || existing.treatment
      },
      include: recordInclude
    });

    return res.json(updated);
  } catch (error) {
    console.error('Error in updateMedicalRecord:', error);
    if (error.code === 'P2003') {
      return res.status(400).json({
        error: 'Foreign key violation: patient_id or doctor_id do not exist'
      });
    }
    return res.status(500).json({ error: 'Failed to update medical record' });
  }
};

/**
 * DELETE /api/medical-records/:id
 * Elimina un historial
 */
exports.deleteMedicalRecord = async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid record ID' });
  }

  try {
    const existing = await prisma.medical_records.findUnique({
      where: { record_id: id }
    });
    if (!existing) {
      return res.status(404).json({ error: 'Medical record not found' });
    }

    await prisma.medical_records.delete({
      where: { record_id: id }
    });

    return res.status(204).send();
  } catch (error) {
    console.error('Error in deleteMedicalRecord:', error);
    return res.status(500).json({ error: 'Failed to delete medical record' });
  }
};
