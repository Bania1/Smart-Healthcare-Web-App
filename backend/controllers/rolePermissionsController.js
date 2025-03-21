// controllers/rolePermissionsController.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * GET /api/role-permissions
 * Listar todas las relaciones role_permissions
 */
exports.getAllRolePermissions = async (req, res) => {
  try {
    const allRP = await prisma.role_permissions.findMany({
      // Si quieres incluir los datos de roles o permissions, puedes usar include:
      // include: {
      //   roles: true,
      //   permissions: true
      // }
    });
    return res.status(200).json(allRP);
  } catch (error) {
    console.error('Error en getAllRolePermissions:', error);
    return res.status(500).json({ error: 'Error al obtener las relaciones roles-permissions' });
  }
};

/**
 * GET /api/role-permissions/:role_id/:permission_id
 * Obtener una relación específica por la clave compuesta
 */
exports.getRolePermission = async (req, res) => {
  try {
    const { role_id, permission_id } = req.params;

    const rp = await prisma.role_permissions.findUnique({
      where: {
        role_id_permission_id: {
          role_id: Number(role_id),
          permission_id: Number(permission_id)
        }
      },
      // include: { roles: true, permissions: true } // si deseas datos de las otras tablas
    });

    if (!rp) {
      return res.status(404).json({ error: 'Relación role_permission no encontrada' });
    }

    return res.status(200).json(rp);
  } catch (error) {
    console.error('Error en getRolePermission:', error);
    return res.status(500).json({ error: 'Error al obtener la relación role_permission' });
  }
};

/**
 * POST /api/role-permissions
 * Crear una nueva relación role_permission
 */
exports.createRolePermission = async (req, res) => {
  try {
    const { role_id, permission_id } = req.body;

    // Validaciones mínimas
    if (!role_id || !permission_id) {
      return res.status(400).json({ error: 'Faltan campos obligatorios (role_id, permission_id)' });
    }

    // Creamos la relación
    const newRP = await prisma.role_permissions.create({
      data: {
        role_id: Number(role_id),
        permission_id: Number(permission_id)
      }
    });

    return res.status(201).json(newRP);
  } catch (error) {
    console.error('Error en createRolePermission:', error);
    // Si ya existe esa relación (clave compuesta duplicada), Prisma lanza un error code P2002
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'Ya existe esta relación role_id-permission_id' });
    }
    return res.status(500).json({ error: error.message }); 
  }
};

/**
 * PUT /api/role-permissions/:role_id/:permission_id
 * Actualizar una relación role_permission
 * (No siempre tiene sentido "actualizar" la clave compuesta, pero lo ponemos a modo de ejemplo)
 */
exports.updateRolePermission = async (req, res) => {
  try {
    const { role_id, permission_id } = req.params;
    const { new_role_id, new_permission_id } = req.body;

    // Verificamos si existe
    const existingRP = await prisma.role_permissions.findUnique({
      where: {
        role_id_permission_id: {
          role_id: Number(role_id),
          permission_id: Number(permission_id)
        }
      }
    });
    if (!existingRP) {
      return res.status(404).json({ error: 'Relación role_permission no encontrada' });
    }

    // Si deseas "mover" la relación a otros IDs (p.ej., role_id=2, permission_id=5),
    // Prisma no te deja cambiar la PK directamente en un update. Tienes que borrar y volver a crear,
    // o usar un upsert. Pero a modo de ejemplo, lo hacemos con delete+create o con la API de updateMany.

    // Aquí, la forma más directa: borra la relación actual y crea la nueva
    // (OJO: no es un "update" real de la PK compuesta)
    if (new_role_id || new_permission_id) {
      // Borrar la relación actual
      await prisma.role_permissions.delete({
        where: {
          role_id_permission_id: {
            role_id: Number(role_id),
            permission_id: Number(permission_id)
          }
        }
      });

      // Crear la nueva relación
      const newRP = await prisma.role_permissions.create({
        data: {
          role_id: new_role_id ? Number(new_role_id) : Number(role_id),
          permission_id: new_permission_id ? Number(new_permission_id) : Number(permission_id)
        }
      });

      return res.status(200).json(newRP);
    }

    // Si no hay cambios en la PK, no hay nada que actualizar.
    return res.status(200).json(existingRP);
  } catch (error) {
    console.error('Error en updateRolePermission:', error);
    // P2002 si ya existe esa relación
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'La nueva relación ya existe' });
    }
    return res.status(500).json({ error: 'Error al actualizar la relación role_permission' });
  }
};

/**
 * DELETE /api/role-permissions/:role_id/:permission_id
 * Eliminar una relación role_permission
 */
exports.deleteRolePermission = async (req, res) => {
  try {
    const { role_id, permission_id } = req.params;

    // Verificamos si existe
    const existingRP = await prisma.role_permissions.findUnique({
      where: {
        role_id_permission_id: {
          role_id: Number(role_id),
          permission_id: Number(permission_id)
        }
      }
    });
    if (!existingRP) {
      return res.status(404).json({ error: 'Relación role_permission no encontrada' });
    }

    await prisma.role_permissions.delete({
      where: {
        role_id_permission_id: {
          role_id: Number(role_id),
          permission_id: Number(permission_id)
        }
      }
    });

    return res.status(204).send(); // No Content
  } catch (error) {
    console.error('Error en deleteRolePermission:', error);
    return res.status(500).json({ error: 'Error al eliminar la relación role_permission' });
  }
};
