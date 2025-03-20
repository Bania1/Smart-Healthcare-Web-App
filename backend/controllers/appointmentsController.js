// controllers/appointmentsController.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * GET /api/appointments
 * Obtener todas las citas
 */
exports.getAllAppointments = async (req, res) => {
  try {
    // Busca todos los registros en la tabla "appointments"
    const allAppointments = await prisma.appointments.findMany();
    return res.status(200).json(allAppointments);
  } catch (error) {
    console.error('Error en getAllAppointments:', error);
    return res.status(500).json({ error: 'Error al obtener las citas' });
  }
};

/**
 * GET /api/appointments/:id
 * Obtener una cita por ID
 */
exports.getAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await prisma.appointments.findUnique({
      where: { appointment_id: Number(id) },
      // Si quieres incluir la relación con el doctor y el paciente, puedes hacer:
      // include: {
      //   users_appointments_doctor_idTousers: true,
      //   users_appointments_patient_idTousers: true
      // }
    });

    if (!appointment) {
      return res.status(404).json({ error: 'Cita no encontrada' });
    }

    return res.status(200).json(appointment);
  } catch (error) {
    console.error('Error en getAppointmentById:', error);
    return res.status(500).json({ error: 'Error al obtener la cita' });
  }
};

/**
 * POST /api/appointments
 * Crear una nueva cita
 */
exports.createAppointment = async (req, res) => {
  try {
    const { date_time, status, doctor_id, patient_id } = req.body;

    // Ejemplo de validaciones mínimas (puedes personalizarlas)
    if (!date_time || !status) {
      return res.status(400).json({ error: 'Faltan campos obligatorios (date_time, status)' });
    }

    const newAppointment = await prisma.appointments.create({
      data: {
        date_time: new Date(date_time), // Asegúrate de parsear correctamente
        status,
        doctor_id,
        patient_id
      },
    });

    return res.status(201).json(newAppointment);
  } catch (error) {
    console.error('Error en createAppointment:', error);
    return res.status(500).json({ error: 'Error al crear la cita' });
  }
};

/**
 * PUT /api/appointments/:id
 * Actualizar una cita existente
 */
exports.updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { date_time, status, doctor_id, patient_id } = req.body;

    // Verificar si existe
    const existingAppointment = await prisma.appointments.findUnique({
      where: { appointment_id: Number(id) },
    });
    if (!existingAppointment) {
      return res.status(404).json({ error: 'Cita no encontrada' });
    }

    const updatedAppointment = await prisma.appointments.update({
      where: { appointment_id: Number(id) },
      data: {
        // Si envías date_time, conviértelo a Date. Si no lo envías, conserva el existente
        date_time: date_time ? new Date(date_time) : existingAppointment.date_time,
        status: status ?? existingAppointment.status,
        doctor_id: doctor_id ?? existingAppointment.doctor_id,
        patient_id: patient_id ?? existingAppointment.patient_id
      },
    });

    return res.status(200).json(updatedAppointment);
  } catch (error) {
    console.error('Error en updateAppointment:', error);
    return res.status(500).json({ error: 'Error al actualizar la cita' });
  }
};

/**
 * DELETE /api/appointments/:id
 * Eliminar una cita
 */
exports.deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar si existe
    const existingAppointment = await prisma.appointments.findUnique({
      where: { appointment_id: Number(id) },
    });
    if (!existingAppointment) {
      return res.status(404).json({ error: 'Cita no encontrada' });
    }

    await prisma.appointments.delete({
      where: { appointment_id: Number(id) },
    });

    return res.status(204).send(); // No Content
  } catch (error) {
    console.error('Error en deleteAppointment:', error);
    return res.status(500).json({ error: 'Error al eliminar la cita' });
  }
};
