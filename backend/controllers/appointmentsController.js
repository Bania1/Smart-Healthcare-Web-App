// controllers/appointmentsController.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * GET /api/appointments
 * Recupera todas las citas (con datos de paciente y médico).
 */
// exports.getAllAppointments
exports.getAllAppointments = async (req, res) => {
  try {
    const where = {};
    // Si es paciente, solo sus citas
    if (req.user.roles.includes('Patient')) {
      where.patient_id = req.user.userId;
    }
    const allAppointments = await prisma.appointments.findMany({
      where,
      include: {
        users_appointments_patient_idTousers: { select: { user_id:true, name:true, dni:true } },
        users_appointments_doctor_idTousers:  { select: { user_id:true, name:true, dni:true } },
      },
      orderBy: { date_time: 'desc' }
    });
    return res.status(200).json(allAppointments);
  } catch (error) {
    console.error('Error in getAllAppointments:', error);
    return res.status(500).json({ error: 'Failed to retrieve appointments' });
  }
};

// exports.getAppointmentById
exports.getAppointmentById = async (req, res) => {
  const id = Number(req.params.id);
  try {
    const appointment = await prisma.appointments.findUnique({
      where: { appointment_id: id },
      include: {
        users_appointments_patient_idTousers: { select: { user_id:true, name:true, dni:true } },
        users_appointments_doctor_idTousers:  { select: { user_id:true, name:true, dni:true } },
      }
    });
    if (!appointment) return res.status(404).json({ error: 'Appointment not found' });

    // Si es paciente, verificar que sea SU cita
    if (req.user.roles.includes('Patient') && appointment.patient_id !== req.user.userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    return res.status(200).json(appointment);
  } catch (error) {
    console.error('Error in getAppointmentById:', error);
    return res.status(500).json({ error: 'Failed to retrieve the appointment' });
  }
};


/**
 * POST /api/appointments
 * Crea una nueva cita.
 * Acepta:
 *  - date_time (ISO completo)
 *  - O bien date (YYYY-MM-DD) + time (HH:MM)
 */
exports.createAppointment = async (req, res) => {
  try {
    const { patient_id, doctor_id, date_time, date, time, status } = req.body;

    // 1) Validación básica
    if (
      !patient_id ||
      !doctor_id ||
      !status ||
      !( date_time || (date && time) )
    ) {
      return res.status(400).json({
        error: 'Missing required fields: patient_id, doctor_id, status, and either date_time OR both date & time'
      });
    }

    // 2) Construcción del Date
    let dt;
    if (date_time) {
      dt = new Date(date_time);
    } else {
      // añadimos segundos y milis, y marcamos Z para UTC
      dt = new Date(`${date}T${time}:00.000Z`);
    }
    if (isNaN(dt)) {
      return res.status(400).json({ error: 'Invalid date_time or date+time format' });
    }

    // 3) Inserción
    const newAppointment = await prisma.appointments.create({
      data: {
        patient_id: Number(patient_id),
        doctor_id:  Number(doctor_id),
        date_time:  dt,
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
      return res.status(400).json({
        error: 'Foreign key violation: patient_id or doctor_id does not exist'
      });
    }
    if (createError.code === 'P2002') {
      return res.status(409).json({
        error: 'An appointment with these data already exists'
      });
    }
    return res.status(500).json({ error: 'Failed to create the appointment' });
  }
};

/**
 * PUT /api/appointments/:id
 * Actualiza una cita existente.
 * Soporta update parcial de campos y fecha/hora en cualquiera de los dos formatos.
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

    const { patient_id, doctor_id, date_time, date, time, status } = req.body;
    const data = {};

    if (patient_id   !== undefined) data.patient_id = Number(patient_id);
    if (doctor_id    !== undefined) data.doctor_id  = Number(doctor_id);
    if (status       !== undefined) data.status     = status;

    // Solo si recibimos algo para la fecha/hora
    if (date_time || (date && time)) {
      let dt;
      if (date_time) dt = new Date(date_time);
      else            dt = new Date(`${date}T${time}:00.000Z`);

      if (isNaN(dt)) {
        return res.status(400).json({ error: 'Invalid date_time or date+time format' });
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
      return res.status(400).json({
        error: 'Foreign key violation: patient_id or doctor_id does not exist'
      });
    }
    if (updateError.code === 'P2002') {
      return res.status(409).json({
        error: 'An appointment with these data already exists'
      });
    }
    return res.status(500).json({ error: 'Failed to update the appointment' });
  }
};

/**
 * DELETE /api/appointments/:id
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
