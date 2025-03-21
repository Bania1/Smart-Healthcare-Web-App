// controllers/rolesController.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * GET /api/roles
 * Obtener todos los roles
 */
exports.getAllRoles = async (req, res) => {
  try {
    const allRoles = await prisma.roles.findMany();
    return res.status(200).json(allRoles);
  } catch (error) {
    console.error('Error en getAllRoles:', error);
    return res.status(500).json({ error: 'Error al obtener los roles' });
  }
};

/**
 * GET /api/roles/:id
 * Obtener un rol por ID
 */
exports.getRoleById = async (req, res) => {
  try {
    const { id } = req.params;
    const role = await prisma.roles.findUnique({
      where: { role_id: Number(id) },
      // include: { role_permissions: true, user_roles: true } // si quieres traer relaciones
    });

    if (!role) {
      return res.status(404).json({ error: 'Rol no encontrado' });
    }

    return res.status(200).json(role);
  } catch (error) {
    console.error('Error en getRoleById:', error);
    return res.status(500).json({ error: 'Error al obtener el rol' });
  }
};

/**
 * POST /api/roles
 * Crear un nuevo rol
 */
exports.createRole = async (req, res) => {
  try {
    const { role_name } = req.body;

    if (!role_name) {
      return res.status(400).json({ error: 'Falta el campo role_name' });
    }

    const newRole = await prisma.roles.create({
      data: { role_name },
    });

    return res.status(201).json(newRole);
  } catch (error) {
    console.error('Error en createRole:', error);
    // Manejo de error por unique constraint (P2002) si role_name ya existe
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'El nombre del rol ya existe' });
    }
    return res.status(500).json({ error: 'Error al crear el rol' });
  }
};

/**
 * PUT /api/roles/:id
 * Actualizar un rol
 */
exports.updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role_name } = req.body;

    // Verificamos si existe
    const existingRole = await prisma.roles.findUnique({
      where: { role_id: Number(id) },
    });
    if (!existingRole) {
      return res.status(404).json({ error: 'Rol no encontrado' });
    }

    const updatedRole = await prisma.roles.update({
      where: { role_id: Number(id) },
      data: {
        role_name: role_name ?? existingRole.role_name,
      },
    });

    return res.status(200).json(updatedRole);
  } catch (error) {
    console.error('Error en updateRole:', error);
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'El nombre del rol ya existe' });
    }
    return res.status(500).json({ error: 'Error al actualizar el rol' });
  }
};

/**
 * DELETE /api/roles/:id
 * Eliminar un rol
 */
exports.deleteRole = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificamos si existe
    const existingRole = await prisma.roles.findUnique({
      where: { role_id: Number(id) },
    });
    if (!existingRole) {
      return res.status(404).json({ error: 'Rol no encontrado' });
    }

    await prisma.roles.delete({
      where: { role_id: Number(id) },
    });

    return res.status(204).send(); // No Content
  } catch (error) {
    console.error('Error en deleteRole:', error);
    return res.status(500).json({ error: 'Error al eliminar el rol' });
  }
};
