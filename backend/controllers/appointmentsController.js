// controllers/appointmentsController.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * GET /api/appointments
 * Retrieve all appointments
 */
exports.getAllAppointments = async (req, res) => {
  try {
    // Fetch all records from the "appointments" table
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
    const { id } = req.params;
    const appointment = await prisma.appointments.findUnique({
      where: { appointment_id: Number(id) },
      // If you want to include doctor/patient data, you can do:
      // include: {
      //   users_appointments_doctor_idTousers: true,
      //   users_appointments_patient_idTousers: true
      // }
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
    const { date_time, status, doctor_id, patient_id } = req.body;

    // Basic validations
    if (!date_time || !status) {
      return res.status(400).json({ error: 'Missing required fields (date_time, status)' });
    }

    try {
      const newAppointment = await prisma.appointments.create({
        data: {
          date_time: new Date(date_time), // Ensure proper parsing
          status,
          doctor_id,
          patient_id
        },
      });

      return res.status(201).json(newAppointment);
    } catch (createError) {
      console.error('Error in createAppointment (Prisma):', createError);

      // If there's a foreign key violation (P2003), e.g., doctor_id or patient_id not existing
      if (createError.code === 'P2003') {
        return res.status(400).json({
          error: 'Foreign key violation: doctor_id or patient_id do not exist'
        });
      }
      // If there's a unique constraint violation (P2002), if you had constraints
      // e.g., same date/time with same doctor not allowed
      if (createError.code === 'P2002') {
        return res.status(409).json({
          error: 'An appointment with these constraints already exists'
        });
      }
      return res.status(500).json({ error: 'Failed to create the appointment' });
    }
  } catch (error) {
    console.error('Error in createAppointment (general):', error);
    return res.status(500).json({ error: 'Internal error while creating the appointment' });
  }
};

/**
 * PUT /api/appointments/:id
 * Update an existing appointment
 */
exports.updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { date_time, status, doctor_id, patient_id } = req.body;

    // Check if it exists
    const existingAppointment = await prisma.appointments.findUnique({
      where: { appointment_id: Number(id) },
    });
    if (!existingAppointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    try {
      const updatedAppointment = await prisma.appointments.update({
        where: { appointment_id: Number(id) },
        data: {
          // If date_time is sent, convert to Date; otherwise, keep existing
          date_time: date_time ? new Date(date_time) : existingAppointment.date_time,
          status: status ?? existingAppointment.status,
          doctor_id: doctor_id ?? existingAppointment.doctor_id,
          patient_id: patient_id ?? existingAppointment.patient_id
        },
      });

      return res.status(200).json(updatedAppointment);
    } catch (updateError) {
      console.error('Error in updateAppointment (Prisma):', updateError);

      if (updateError.code === 'P2003') {
        return res.status(400).json({
          error: 'Foreign key violation: doctor_id or patient_id do not exist'
        });
      }
      if (updateError.code === 'P2002') {
        return res.status(409).json({
          error: 'An appointment with these constraints already exists'
        });
      }
      return res.status(500).json({ error: 'Failed to update the appointment' });
    }
  } catch (error) {
    console.error('Error in updateAppointment (general):', error);
    return res.status(500).json({ error: 'Internal error while updating the appointment' });
  }
};

/**
 * DELETE /api/appointments/:id
 * Delete an appointment
 */
exports.deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if it exists
    const existingAppointment = await prisma.appointments.findUnique({
      where: { appointment_id: Number(id) },
    });
    if (!existingAppointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    await prisma.appointments.delete({
      where: { appointment_id: Number(id) },
    });

    return res.status(204).send(); // No Content
  } catch (error) {
    console.error('Error in deleteAppointment:', error);
    return res.status(500).json({ error: 'Failed to delete the appointment' });
  }
};
