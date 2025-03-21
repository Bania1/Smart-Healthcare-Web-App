// controllers/usersDetailsController.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * GET /api/users-details
 * Obtener todos los registros de users_details
 */
exports.getAllUsersDetails = async (req, res) => {
  try {
    const allDetails = await prisma.users_details.findMany({
      // Si deseas incluir datos de la tabla "users", puedes hacer:
      // include: { users: true }
    });
    return res.status(200).json(allDetails);
  } catch (error) {
    console.error('Error en getAllUsersDetails:', error);
    return res.status(500).json({ error: 'Error al obtener los users_details' });
  }
};

/**
 * GET /api/users-details/:user_id
 * Obtener los detalles de un usuario por su user_id
 */
exports.getUserDetailsById = async (req, res) => {
  try {
    const { user_id } = req.params;
    const details = await prisma.users_details.findUnique({
      where: { user_id: Number(user_id) },
      // include: { users: true } // si quieres traer datos de la tabla "users"
    });

    if (!details) {
      return res.status(404).json({ error: 'Detalles no encontrados para ese user_id' });
    }

    return res.status(200).json(details);
  } catch (error) {
    console.error('Error en getUserDetailsById:', error);
    return res.status(500).json({ error: 'Error al obtener los detalles del usuario' });
  }
};

/**
 * POST /api/users-details
 * Crear un nuevo registro en users_details
 */
exports.createUserDetails = async (req, res) => {
  try {
    const { user_id, specialty, availability, date_of_birth, contact_info } = req.body;

    // Validaciones mínimas
    if (!user_id) {
      return res.status(400).json({ error: 'Falta el campo user_id (clave primaria)' });
    }

    // Insertar en la tabla
    const newDetails = await prisma.users_details.create({
      data: {
        user_id: Number(user_id),
        specialty,
        availability,
        // Si date_of_birth viene como string, la parseamos
        date_of_birth: date_of_birth ? new Date(date_of_birth) : null,
        contact_info
      }
    });

    return res.status(201).json(newDetails);
  } catch (error) {
    console.error('Error en createUserDetails:', error);

    // P2002 = Unique constraint. Significa que ya existe un users_details con ese user_id
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'Ya existe un registro de users_details para ese user_id' });
    }
    // P2003 = Foreign key constraint. user_id no existe en la tabla "users"
    if (error.code === 'P2003') {
      return res.status(400).json({ error: 'Violación de llave foránea: user_id no existe en la tabla "users"' });
    }

    return res.status(500).json({ error: 'Error al crear el registro de users_details' });
  }
};

/**
 * PUT /api/users-details/:user_id
 * Actualizar un registro en users_details
 */
exports.updateUserDetails = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { specialty, availability, date_of_birth, contact_info } = req.body;

    // Verificar si existe
    const existingDetails = await prisma.users_details.findUnique({
      where: { user_id: Number(user_id) }
    });
    if (!existingDetails) {
      return res.status(404).json({ error: 'Detalles no encontrados para ese user_id' });
    }

    const updatedDetails = await prisma.users_details.update({
      where: { user_id: Number(user_id) },
      data: {
        specialty: specialty ?? existingDetails.specialty,
        availability: availability ?? existingDetails.availability,
        date_of_birth: date_of_birth ? new Date(date_of_birth) : existingDetails.date_of_birth,
        contact_info: contact_info ?? existingDetails.contact_info
      }
    });

    return res.status(200).json(updatedDetails);
  } catch (error) {
    console.error('Error en updateUserDetails:', error);
    // Si date_of_birth es inválida o user_id viola algo
    return res.status(500).json({ error: 'Error al actualizar los detalles del usuario' });
  }
};

/**
 * DELETE /api/users-details/:user_id
 * Eliminar un registro de users_details
 */
exports.deleteUserDetails = async (req, res) => {
  try {
    const { user_id } = req.params;

    // Verificar si existe
    const existingDetails = await prisma.users_details.findUnique({
      where: { user_id: Number(user_id) }
    });
    if (!existingDetails) {
      return res.status(404).json({ error: 'Detalles no encontrados para ese user_id' });
    }

    await prisma.users_details.delete({
      where: { user_id: Number(user_id) }
    });

    return res.status(204).send(); // No Content
  } catch (error) {
    console.error('Error en deleteUserDetails:', error);
    return res.status(500).json({ error: 'Error al eliminar los detalles del usuario' });
  }
};
