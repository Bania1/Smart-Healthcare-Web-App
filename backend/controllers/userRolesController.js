// controllers/userRolesController.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * GET /api/user-roles
 * Listar todas las relaciones user_roles
 */
exports.getAllUserRoles = async (req, res) => {
  try {
    const allUR = await prisma.user_roles.findMany({
      // Si quieres incluir los datos de roles o users, puedes usar include:
      // include: {
      //   roles: true,
      //   users: true
      // }
    });
    return res.status(200).json(allUR);
  } catch (error) {
    console.error('Error en getAllUserRoles:', error);
    return res.status(500).json({ error: 'Error al obtener las relaciones user_roles' });
  }
};

/**
 * GET /api/user-roles/:user_id/:role_id
 * Obtener una relación específica por la clave compuesta
 */
exports.getUserRole = async (req, res) => {
  try {
    const { user_id, role_id } = req.params;

    const ur = await prisma.user_roles.findUnique({
      where: {
        user_id_role_id: {
          user_id: Number(user_id),
          role_id: Number(role_id)
        }
      },
      // include: { roles: true, users: true } // si deseas datos de las tablas relacionadas
    });

    if (!ur) {
      return res.status(404).json({ error: 'Relación user_role no encontrada' });
    }

    return res.status(200).json(ur);
  } catch (error) {
    console.error('Error en getUserRole:', error);
    return res.status(500).json({ error: 'Error al obtener la relación user_role' });
  }
};

/**
 * POST /api/user-roles
 * Crear una nueva relación user_role
 */
exports.createUserRole = async (req, res) => {
  try {
    const { user_id, role_id } = req.body;

    // Validaciones mínimas
    if (!user_id || !role_id) {
      return res.status(400).json({ error: 'Faltan campos obligatorios (user_id, role_id)' });
    }

    // Creamos la relación
    const newUR = await prisma.user_roles.create({
      data: {
        user_id: Number(user_id),
        role_id: Number(role_id)
      }
    });

    return res.status(201).json(newUR);
  } catch (error) {
    console.error('Error en createUserRole:', error);
    // Si ya existe esa relación (clave compuesta duplicada), Prisma lanza un error code P2002
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'Ya existe esta relación user_id-role_id' });
    }
    // Si es un error de Foreign Key (P2003), significa que user_id o role_id no existen
    if (error.code === 'P2003') {
      return res.status(400).json({ error: 'Violación de llave foránea: user_id o role_id no existen' });
    }
    return res.status(500).json({ error: 'Error al crear la relación user_role' });
  }
};

/**
 * PUT /api/user-roles/:user_id/:role_id
 * Actualizar una relación user_role
 * (Al ser una PK compuesta, no se puede "editar" directamente. Se hace delete + create)
 */
exports.updateUserRole = async (req, res) => {
  try {
    const { user_id, role_id } = req.params;
    const { new_user_id, new_role_id } = req.body;

    // Verificamos si existe la relación actual
    const existingUR = await prisma.user_roles.findUnique({
      where: {
        user_id_role_id: {
          user_id: Number(user_id),
          role_id: Number(role_id)
        }
      }
    });
    if (!existingUR) {
      return res.status(404).json({ error: 'Relación user_role no encontrada' });
    }

    // Si queremos "mover" la relación a (new_user_id, new_role_id),
    // borramos la actual y creamos la nueva.
    if (new_user_id || new_role_id) {
      // Borrar la relación actual
      await prisma.user_roles.delete({
        where: {
          user_id_role_id: {
            user_id: Number(user_id),
            role_id: Number(role_id)
          }
        }
      });

      // Crear la nueva relación
      const newUR = await prisma.user_roles.create({
        data: {
          user_id: new_user_id ? Number(new_user_id) : Number(user_id),
          role_id: new_role_id ? Number(new_role_id) : Number(role_id)
        }
      });

      return res.status(200).json(newUR);
    }

    // Si no hay cambios en la PK, no hay nada que actualizar
    return res.status(200).json(existingUR);
  } catch (error) {
    console.error('Error en updateUserRole:', error);
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'La nueva relación ya existe' });
    }
    if (error.code === 'P2003') {
      return res.status(400).json({ error: 'Violación de llave foránea: user_id o role_id no existen' });
    }
    return res.status(500).json({ error: 'Error al actualizar la relación user_role' });
  }
};

/**
 * DELETE /api/user-roles/:user_id/:role_id
 * Eliminar una relación user_role
 */
exports.deleteUserRole = async (req, res) => {
  try {
    const { user_id, role_id } = req.params;

    // Verificamos si existe
    const existingUR = await prisma.user_roles.findUnique({
      where: {
        user_id_role_id: {
          user_id: Number(user_id),
          role_id: Number(role_id)
        }
      }
    });
    if (!existingUR) {
      return res.status(404).json({ error: 'Relación user_role no encontrada' });
    }

    await prisma.user_roles.delete({
      where: {
        user_id_role_id: {
          user_id: Number(user_id),
          role_id: Number(role_id)
        }
      }
    });

    return res.status(204).send(); // No Content
  } catch (error) {
    console.error('Error en deleteUserRole:', error);
    return res.status(500).json({ error: 'Error al eliminar la relación user_role' });
  }
};
