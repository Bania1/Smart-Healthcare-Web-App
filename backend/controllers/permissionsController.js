// controllers/permissionsController.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * GET /api/permissions
 * Retrieve all permissions
 */
exports.getAllPermissions = async (req, res) => {
  try {
    const allPermissions = await prisma.permissions.findMany();
    return res.status(200).json(allPermissions);
  } catch (error) {
    console.error('Error in getAllPermissions:', error);
    return res.status(500).json({ error: 'Failed to retrieve permissions' });
  }
};

/**
 * GET /api/permissions/:id
 * Retrieve a permission by ID
 */
exports.getPermissionById = async (req, res) => {
  try {
    const { id } = req.params;
    const permission = await prisma.permissions.findUnique({
      where: { permission_id: Number(id) },
      // If you want to include "role_permissions" data, for example:
      // include: {
      //   role_permissions: true
      // }
    });

    if (!permission) {
      return res.status(404).json({ error: 'Permission not found' });
    }

    return res.status(200).json(permission);
  } catch (error) {
    console.error('Error in getPermissionById:', error);
    return res.status(500).json({ error: 'Failed to retrieve the permission' });
  }
};

/**
 * POST /api/permissions
 * Create a new permission
 */
exports.createPermission = async (req, res) => {
  try {
    const { permission_name } = req.body;

    if (!permission_name) {
      return res.status(400).json({ error: 'Missing permission_name field' });
    }

    const newPermission = await prisma.permissions.create({
      data: { permission_name },
    });

    return res.status(201).json(newPermission);
  } catch (error) {
    console.error('Error in createPermission:', error);
    // If the unique constraint fails (e.g., permission_name is duplicated), return 409 Conflict
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'Permission name already exists' });
    }
    return res.status(500).json({ error: 'Failed to create the permission' });
  }
};

/**
 * PUT /api/permissions/:id
 * Update a permission
 */
exports.updatePermission = async (req, res) => {
  try {
    const { id } = req.params;
    const { permission_name } = req.body;

    // Check if the permission exists
    const existingPermission = await prisma.permissions.findUnique({
      where: { permission_id: Number(id) },
    });
    if (!existingPermission) {
      return res.status(404).json({ error: 'Permission not found' });
    }

    try {
      const updatedPermission = await prisma.permissions.update({
        where: { permission_id: Number(id) },
        data: {
          permission_name: permission_name ?? existingPermission.permission_name,
        },
      });

      return res.status(200).json(updatedPermission);
    } catch (updateError) {
      console.error('Error in updatePermission (Prisma):', updateError);
      if (updateError.code === 'P2002') {
        // Duplicate permission_name
        return res.status(409).json({ error: 'Permission name already exists' });
      }
      return res.status(500).json({ error: 'Failed to update the permission' });
    }
  } catch (error) {
    console.error('Error in updatePermission (general):', error);
    return res.status(500).json({ error: 'Internal error while updating the permission' });
  }
};

/**
 * DELETE /api/permissions/:id
 * Delete a permission
 */
exports.deletePermission = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the permission exists
    const existingPermission = await prisma.permissions.findUnique({
      where: { permission_id: Number(id) },
    });
    if (!existingPermission) {
      return res.status(404).json({ error: 'Permission not found' });
    }

    await prisma.permissions.delete({
      where: { permission_id: Number(id) },
    });

    return res.status(204).send(); // No Content
  } catch (error) {
    console.error('Error in deletePermission:', error);
    return res.status(500).json({ error: 'Failed to delete the permission' });
  }
};
