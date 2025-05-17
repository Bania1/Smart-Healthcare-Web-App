const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// shared include definitions for relations
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
 */
exports.getAllMedicalRecords = async (req, res) => {
  try {
    const where = {};
    // If user is a patient, restrict to their own records
    if (req.user.roles.includes('Patient')) {
      where.patient_id = req.user.user_id;
    }

    const records = await prisma.medical_records.findMany({
      where,
      include: recordInclude,
      orderBy: [
        { date: 'desc' },
        { time: 'desc' }
      ]
    });

    return res.json(records);
  } catch (error) {
    console.error('Error in getAllMedicalRecords:', error);
    return res.status(500).json({ error: error.message });
  }
};

/**
 * GET /api/medical-records/:id
 */
exports.getMedicalRecordById = async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid record ID' });
  }

  try {
    const record = await prisma.medical_records.findUnique({
      where: { record_id: id },
      include: recordInclude
    });
    if (!record) {
      return res.status(404).json({ error: 'Medical record not found' });
    }
    // Patients can only fetch their own record
    if (req.user.roles.includes('Patient') && record.patient_id !== req.user.user_id) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    return res.json(record);
  } catch (error) {
    console.error('Error in getMedicalRecordById:', error);
    return res.status(500).json({ error: error.message });
  }
};

/**
 * POST /api/medical-records
 */
exports.createMedicalRecord = async (req, res) => {
  try {
    let { patient_id, doctor_id, date, time, type, diagnostic, treatment } = req.body;

    // Basic required-field check
    if (!patient_id || !doctor_id || !date || !time || !type) {
      return res.status(400).json({ error: 'Missing required fields: patient_id, doctor_id, date, time, type' });
    }

    // Parse into JS Date for date-only column
    const dateObj = new Date(date);
    if (isNaN(dateObj)) {
      return res.status(400).json({ error: 'Invalid date format' });
    }
    // Parse time-only into JS Date (date part ignored)
    const timeObj = new Date(`1970-01-01T${time}:00`);
    if (isNaN(timeObj)) {
      return res.status(400).json({ error: 'Invalid time format' });
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
      return res.status(400).json({ error: 'Foreign key violation: patient_id or doctor_id do not exist' });
    }
    return res.status(500).json({ error: error.message });
  }
};

/**
 * PUT /api/medical-records/:id
 */
exports.updateMedicalRecord = async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid record ID' });
  }

  try {
    const existing = await prisma.medical_records.findUnique({ where: { record_id: id } });
    if (!existing) {
      return res.status(404).json({ error: 'Medical record not found' });
    }

    const { patient_id, doctor_id, date, time, type, diagnostic, treatment } = req.body;
    const data = {};
    if (patient_id) data.patient_id = Number(patient_id);
    if (doctor_id)  data.doctor_id  = Number(doctor_id);
    if (type)       data.type       = type;
    if (date) {
      const d = new Date(date);
      if (isNaN(d)) return res.status(400).json({ error: 'Invalid date format' });
      data.date = d;
    }
    if (time) {
      const t = new Date(`1970-01-01T${time}:00`);
      if (isNaN(t)) return res.status(400).json({ error: 'Invalid time format' });
      data.time = t;
    }
    if (diagnostic !== undefined) data.diagnostic = diagnostic;
    if (treatment  !== undefined) data.treatment  = treatment;

    const updated = await prisma.medical_records.update({
      where: { record_id: id },
      data,
      include: recordInclude
    });

    return res.json(updated);
  } catch (error) {
    console.error('Error in updateMedicalRecord:', error);
    return res.status(500).json({ error: error.message });
  }
};

/**
 * DELETE /api/medical-records/:id
 */
exports.deleteMedicalRecord = async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid record ID' });
  }

  try {
    const existing = await prisma.medical_records.findUnique({ where: { record_id: id } });
    if (!existing) {
      return res.status(404).json({ error: 'Medical record not found' });
    }
    await prisma.medical_records.delete({ where: { record_id: id } });
    return res.status(204).send();
  } catch (error) {
    console.error('Error in deleteMedicalRecord:', error);
    return res.status(500).json({ error: error.message });
  }
};
