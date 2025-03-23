// controllers/rolePermissionsController.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * GET /api/role-permissions
 * List all role_permissions relationships
 */
exports.getAllRolePermissions = async (req, res) => {
  try {
    const allRP = await prisma.role_permissions.findMany({
      // If you want to include data from the "roles" or "permissions" tables, you can do:
      // include: {
      //   roles: true,
      //   permissions: true
      // }
    });
    return res.status(200).json(allRP);
  } catch (error) {
    console.error('Error in getAllRolePermissions:', error);
    return res.status(500).json({ error: 'Failed to retrieve role_permissions relationships' });
  }
};

/**
 * GET /api/role-permissions/:role_id/:permission_id
 * Retrieve a specific relationship by the composite key
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
      // include: { roles: true, permissions: true } // if you want related data
    });

    if (!rp) {
      return res.status(404).json({ error: 'role_permission relationship not found' });
    }

    return res.status(200).json(rp);
  } catch (error) {
    console.error('Error in getRolePermission:', error);
    return res.status(500).json({ error: 'Failed to retrieve the role_permission relationship' });
  }
};

/**
 * POST /api/role-permissions
 * Create a new role_permission relationship
 */
exports.createRolePermission = async (req, res) => {
  try {
    const { role_id, permission_id } = req.body;

    // Basic validations
    if (!role_id || !permission_id) {
      return res.status(400).json({ error: 'Missing required fields (role_id, permission_id)' });
    }

    // Create the relationship
    const newRP = await prisma.role_permissions.create({
      data: {
        role_id: Number(role_id),
        permission_id: Number(permission_id)
      }
    });

    return res.status(201).json(newRP);
  } catch (error) {
    console.error('Error in createRolePermission:', error);
    // If this relationship already exists (duplicate composite key), Prisma throws P2002
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'This role_id-permission_id relationship already exists' });
    }
    // If it's a foreign key error (P2003), role_id or permission_id does not exist in their respective tables
    if (error.code === 'P2003') {
      return res.status(400).json({ error: 'Foreign key violation: role_id or permission_id do not exist' });
    }
    return res.status(500).json({ error: error.message });
  }
};

/**
 * PUT /api/role-permissions/:role_id/:permission_id
 * Update a role_permission relationship
 * (It usually doesn't make sense to "update" the composite key, but here's an example)
 */
exports.updateRolePermission = async (req, res) => {
  try {
    const { role_id, permission_id } = req.params;
    const { new_role_id, new_permission_id } = req.body;

    // Check if the current relationship exists
    const existingRP = await prisma.role_permissions.findUnique({
      where: {
        role_id_permission_id: {
          role_id: Number(role_id),
          permission_id: Number(permission_id)
        }
      }
    });
    if (!existingRP) {
      return res.status(404).json({ error: 'role_permission relationship not found' });
    }

    // If we want to "move" the relationship to (new_role_id, new_permission_id),
    // Prisma doesn't allow directly updating the composite PK. We delete and recreate instead.
    if (new_role_id || new_permission_id) {
      // Delete the current relationship
      await prisma.role_permissions.delete({
        where: {
          role_id_permission_id: {
            role_id: Number(role_id),
            permission_id: Number(permission_id)
          }
        }
      });

      // Create the new relationship
      const newRP = await prisma.role_permissions.create({
        data: {
          role_id: new_role_id ? Number(new_role_id) : Number(role_id),
          permission_id: new_permission_id ? Number(new_permission_id) : Number(permission_id)
        }
      });

      return res.status(200).json(newRP);
    }

    // If the composite key doesn't change, there's nothing to update
    return res.status(200).json(existingRP);
  } catch (error) {
    console.error('Error in updateRolePermission:', error);
    // If the new composite key already exists
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'The new relationship already exists' });
    }
    // If there's a foreign key violation
    if (error.code === 'P2003') {
      return res.status(400).json({ error: 'Foreign key violation: role_id or permission_id do not exist' });
    }
    return res.status(500).json({ error: 'Failed to update the role_permission relationship' });
  }
};

/**
 * DELETE /api/role-permissions/:role_id/:permission_id
 * Delete a role_permission relationship
 */
exports.deleteRolePermission = async (req, res) => {
  try {
    const { role_id, permission_id } = req.params;

    // Check if it exists
    const existingRP = await prisma.role_permissions.findUnique({
      where: {
        role_id_permission_id: {
          role_id: Number(role_id),
          permission_id: Number(permission_id)
        }
      }
    });
    if (!existingRP) {
      return res.status(404).json({ error: 'role_permission relationship not found' });
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
    console.error('Error in deleteRolePermission:', error);
    return res.status(500).json({ error: 'Failed to delete the role_permission relationship' });
  }
};
