// controllers/permissionsController.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * GET /api/permissions
 * Obtener todas las permissions
 */
exports.getAllPermissions = async (req, res) => {
  try {
    const allPermissions = await prisma.permissions.findMany();
    return res.status(200).json(allPermissions);
  } catch (error) {
    console.error('Error en getAllPermissions:', error);
    return res.status(500).json({ error: 'Error al obtener los permisos' });
  }
};

/**
 * GET /api/permissions/:id
 * Obtener un permiso por ID
 */
exports.getPermissionById = async (req, res) => {
  try {
    const { id } = req.params;
    const permission = await prisma.permissions.findUnique({
      where: { permission_id: Number(id) },
      // Si quieres incluir la relación con role_permissions, podrías hacer:
      // include: {
      //   role_permissions: true
      // }
    });

    if (!permission) {
      return res.status(404).json({ error: 'Permiso no encontrado' });
    }

    return res.status(200).json(permission);
  } catch (error) {
    console.error('Error en getPermissionById:', error);
    return res.status(500).json({ error: 'Error al obtener el permiso' });
  }
};

/**
 * POST /api/permissions
 * Crear un nuevo permiso
 */
exports.createPermission = async (req, res) => {
  try {
    const { permission_name } = req.body;

    if (!permission_name) {
      return res.status(400).json({ error: 'Falta el campo permission_name' });
    }

    const newPermission = await prisma.permissions.create({
      data: {
        permission_name,
      },
    });

    return res.status(201).json(newPermission);
  } catch (error) {
    console.error('Error en createPermission:', error);
    // Si falla por la constraint unique (permission_name duplicado), puedes devolver un 409 (Conflict)
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'El nombre de permiso ya existe' });
    }
    return res.status(500).json({ error: 'Error al crear el permiso' });
  }
};

/**
 * PUT /api/permissions/:id
 * Actualizar un permiso
 */
exports.updatePermission = async (req, res) => {
  try {
    const { id } = req.params;
    const { permission_name } = req.body;

    // Verificamos si existe
    const existingPermission = await prisma.permissions.findUnique({
      where: { permission_id: Number(id) },
    });
    if (!existingPermission) {
      return res.status(404).json({ error: 'Permiso no encontrado' });
    }

    const updatedPermission = await prisma.permissions.update({
      where: { permission_id: Number(id) },
      data: {
        permission_name: permission_name ?? existingPermission.permission_name,
      },
    });

    return res.status(200).json(updatedPermission);
  } catch (error) {
    console.error('Error en updatePermission:', error);
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'El nombre de permiso ya existe' });
    }
    return res.status(500).json({ error: 'Error al actualizar el permiso' });
  }
};

/**
 * DELETE /api/permissions/:id
 * Eliminar un permiso
 */
exports.deletePermission = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificamos si existe
    const existingPermission = await prisma.permissions.findUnique({
      where: { permission_id: Number(id) },
    });
    if (!existingPermission) {
      return res.status(404).json({ error: 'Permiso no encontrado' });
    }

    await prisma.permissions.delete({
      where: { permission_id: Number(id) },
    });

    return res.status(204).send(); // No Content
  } catch (error) {
    console.error('Error en deletePermission:', error);
    return res.status(500).json({ error: 'Error al eliminar el permiso' });
  }
};
