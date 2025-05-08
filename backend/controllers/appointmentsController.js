// controllers/appointmentsController.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * GET /api/appointments
 * Retrieve all appointments (with patient & doctor)
 */
exports.getAllAppointments = async (req, res) => {
  try {
    const allAppointments = await prisma.appointments.findMany({
      include: {
        users_appointments_patient_idTousers: {
          select: { user_id: true, name: true, dni: true }
        },
        users_appointments_doctor_idTousers: {
          select: { user_id: true, name: true, dni: true }
        }
      }
    });
    return res.status(200).json(allAppointments);
  } catch (error) {
    console.error('Error in getAllAppointments:', error);
    return res.status(500).json({ error: 'Failed to retrieve appointments' });
  }
};

/**
 * GET /api/appointments/:id
 * Retrieve an appointment by ID (with patient & doctor)
 */
exports.getAppointmentById = async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid appointment ID' });
  }

  try {
    const appointment = await prisma.appointments.findUnique({
      where: { appointment_id: id },
      include: {
        users_appointments_patient_idTousers: {
          select: { user_id: true, name: true, dni: true }
        },
        users_appointments_doctor_idTousers: {
          select: { user_id: true, name: true, dni: true }
        }
      }
    });

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    return res.status(200).json(appointment);
  } catch (error) {
    console.error('Error in getAppointmentById:', error);
    return res.status(500).json({ error: 'Failed to retrieve the appointment' });
  }
};

/**
 * POST /api/appointments
 * Create a new appointment
 */
exports.createAppointment = async (req, res) => {
  try {
    const { patient_id, doctor_id, date, time, status } = req.body;

    // Validación básica
    if (![patient_id, doctor_id, date, time, status].every(v => v !== undefined && v !== '')) {
      return res.status(400).json({
        error: 'Missing required fields: patient_id, doctor_id, date, time, status'
      });
    }

    // Combina y parsea
    const iso = `${date}T${time}:00.000Z`;
    const dateTime = new Date(iso);
    if (isNaN(dateTime)) {
      return res.status(400).json({ error: 'Invalid date or time format' });
    }

    const newAppointment = await prisma.appointments.create({
      data: {
        patient_id: Number(patient_id),
        doctor_id:  Number(doctor_id),
        date_time:  dateTime,
        status
      },
      include: {
        users_appointments_patient_idTousers: {
          select: { user_id: true, name: true, dni: true }
        },
        users_appointments_doctor_idTousers: {
          select: { user_id: true, name: true, dni: true }
        }
      }
    });

    return res.status(201).json(newAppointment);
  } catch (createError) {
    console.error('Error in createAppointment:', createError);
    if (createError.code === 'P2003') {
      return res
        .status(400)
        .json({ error: 'Foreign key violation: patient_id or doctor_id does not exist' });
    }
    if (createError.code === 'P2002') {
      return res
        .status(409)
        .json({ error: 'An appointment with these data already exists' });
    }
    return res.status(500).json({ error: 'Failed to create the appointment' });
  }
};

/**
 * PUT /api/appointments/:id
 * Update an existing appointment
 */
exports.updateAppointment = async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid appointment ID' });
  }

  try {
    const existing = await prisma.appointments.findUnique({
      where: { appointment_id: id }
    });
    if (!existing) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    const { patient_id, doctor_id, date, time, status } = req.body;
    const data = {};

    if (patient_id !== undefined) data.patient_id = Number(patient_id);
    if (doctor_id  !== undefined) data.doctor_id  = Number(doctor_id);
    if (status     !== undefined) data.status     = status;

    if (date !== undefined && time !== undefined) {
      const iso = `${date}T${time}:00.000Z`;
      const dt  = new Date(iso);
      if (isNaN(dt)) {
        return res.status(400).json({ error: 'Invalid date or time format' });
      }
      data.date_time = dt;
    }

    const updated = await prisma.appointments.update({
      where: { appointment_id: id },
      data,
      include: {
        users_appointments_patient_idTousers: {
          select: { user_id: true, name: true, dni: true }
        },
        users_appointments_doctor_idTousers: {
          select: { user_id: true, name: true, dni: true }
        }
      }
    });

    return res.status(200).json(updated);
  } catch (updateError) {
    console.error('Error in updateAppointment:', updateError);
    if (updateError.code === 'P2003') {
      return res
        .status(400)
        .json({ error: 'Foreign key violation: patient_id or doctor_id does not exist' });
    }
    if (updateError.code === 'P2002') {
      return res
        .status(409)
        .json({ error: 'An appointment with these data already exists' });
    }
    return res.status(500).json({ error: 'Failed to update the appointment' });
  }
};

/**
 * DELETE /api/appointments/:id
 * Delete an appointment
 */
exports.deleteAppointment = async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid appointment ID' });
  }

  try {
    const existing = await prisma.appointments.findUnique({
      where: { appointment_id: id }
    });
    if (!existing) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    await prisma.appointments.delete({
      where: { appointment_id: id }
    });

    return res.status(204).send();
  } catch (error) {
    console.error('Error in deleteAppointment:', error);
    return res.status(500).json({ error: 'Failed to delete the appointment' });
  }
};
