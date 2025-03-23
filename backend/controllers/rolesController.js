// controllers/rolesController.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * GET /api/roles
 * Retrieve all roles
 */
exports.getAllRoles = async (req, res) => {
  try {
    const allRoles = await prisma.roles.findMany();
    return res.status(200).json(allRoles);
  } catch (error) {
    console.error('Error in getAllRoles:', error);
    return res.status(500).json({ error: 'Failed to retrieve roles' });
  }
};

/**
 * GET /api/roles/:id
 * Retrieve a role by ID
 */
exports.getRoleById = async (req, res) => {
  try {
    const { id } = req.params;
    const role = await prisma.roles.findUnique({
      where: { role_id: Number(id) },
      // include: { role_permissions: true, user_roles: true } // if you want to include relations
    });

    if (!role) {
      return res.status(404).json({ error: 'Role not found' });
    }

    return res.status(200).json(role);
  } catch (error) {
    console.error('Error in getRoleById:', error);
    return res.status(500).json({ error: 'Failed to retrieve the role' });
  }
};

/**
 * POST /api/roles
 * Create a new role
 */
exports.createRole = async (req, res) => {
  try {
    const { role_name } = req.body;

    if (!role_name) {
      return res.status(400).json({ error: 'Missing role_name field' });
    }

    const newRole = await prisma.roles.create({
      data: { role_name },
    });

    return res.status(201).json(newRole);
  } catch (error) {
    console.error('Error in createRole:', error);

    // Handle unique constraint error (P2002) if role_name already exists
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'Role name already exists' });
    }

    return res.status(500).json({ error: 'Failed to create the role' });
  }
};

/**
 * PUT /api/roles/:id
 * Update a role
 */
exports.updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role_name } = req.body;

    // Check if the role exists
    const existingRole = await prisma.roles.findUnique({
      where: { role_id: Number(id) },
    });
    if (!existingRole) {
      return res.status(404).json({ error: 'Role not found' });
    }

    try {
      const updatedRole = await prisma.roles.update({
        where: { role_id: Number(id) },
        data: {
          role_name: role_name ?? existingRole.role_name,
        },
      });

      return res.status(200).json(updatedRole);
    } catch (updateError) {
      console.error('Error in updateRole (Prisma):', updateError);

      if (updateError.code === 'P2002') {
        // role_name conflict
        return res.status(409).json({ error: 'Role name already exists' });
      }

      return res.status(500).json({ error: 'Failed to update the role' });
    }
  } catch (error) {
    console.error('Error in updateRole (general):', error);
    return res.status(500).json({ error: 'Internal error while updating the role' });
  }
};

/**
 * DELETE /api/roles/:id
 * Delete a role
 */
exports.deleteRole = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the role exists
    const existingRole = await prisma.roles.findUnique({
      where: { role_id: Number(id) },
    });
    if (!existingRole) {
      return res.status(404).json({ error: 'Role not found' });
    }

    await prisma.roles.delete({
      where: { role_id: Number(id) },
    });

    return res.status(204).send(); // No Content
  } catch (error) {
    console.error('Error in deleteRole:', error);
    return res.status(500).json({ error: 'Failed to delete the role' });
  }
};
