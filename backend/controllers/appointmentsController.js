// controllers/appointmentsController.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * GET /api/appointments
 * Retrieve all appointments
 */
exports.getAllAppointments = async (req, res) => {
  try {
    const allAppointments = await prisma.appointments.findMany();
    return res.status(200).json(allAppointments);
  } catch (error) {
    console.error('Error in getAllAppointments:', error);
    return res.status(500).json({ error: 'Failed to retrieve appointments' });
  }
};

/**
 * GET /api/appointments/:id
 * Retrieve an appointment by ID
 */
exports.getAppointmentById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid appointment ID' });
    }

    const appointment = await prisma.appointments.findUnique({
      where: { appointment_id: id },
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

    // Validación básica de campos
    if (
      !patient_id || !doctor_id ||
      !date || !time ||
      !status
    ) {
      return res
        .status(400)
        .json({ error: 'Missing required fields: patient_id, doctor_id, date, time, status' });
    }

    // Combina date + time en un Date
    const dateTime = new Date(`${date}T${time}`);
    if (isNaN(dateTime)) {
      return res.status(400).json({ error: 'Invalid date or time format' });
    }

    // Crea la cita
    const newAppointment = await prisma.appointments.create({
      data: {
        patient_id: Number(patient_id),
        doctor_id: Number(doctor_id),
        date_time: dateTime,
        status
      }
    });

    return res.status(201).json(newAppointment);
  } catch (createError) {
    console.error('Error in createAppointment:', createError);

    // Manejo de violaciones de FK
    if (createError.code === 'P2003') {
      return res
        .status(400)
        .json({ error: 'Foreign key violation: doctor_id or patient_id does not exist' });
    }
    // Violación de unicidad
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
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid appointment ID' });
    }

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
    if (date && time) {
      const dateTime = new Date(`${date}T${time}`);
      if (isNaN(dateTime)) {
        return res.status(400).json({ error: 'Invalid date or time format' });
      }
      data.date_time = dateTime;
    }

    const updated = await prisma.appointments.update({
      where: { appointment_id: id },
      data
    });

    return res.status(200).json(updated);
  } catch (updateError) {
    console.error('Error in updateAppointment:', updateError);

    if (updateError.code === 'P2003') {
      return res
        .status(400)
        .json({ error: 'Foreign key violation: doctor_id or patient_id does not exist' });
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
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid appointment ID' });
    }

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
