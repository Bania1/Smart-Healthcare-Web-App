// controllers/userRolesController.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Import the DTO
const CreateUserRoleDto = require('../dtos/createUserRole.dto');

/**
 * GET /api/user-roles
 * List all user_roles relationships
 */
exports.getAllUserRoles = async (req, res) => {
  try {
    const allUR = await prisma.user_roles.findMany({
      // If you want to include data from the "roles" or "users" tables, you can do:
      // include: {
      //   roles: true,
      //   users: true
      // }
    });
    return res.status(200).json(allUR);
  } catch (error) {
    console.error('Error in getAllUserRoles:', error);
    return res.status(500).json({ error: 'Failed to retrieve user_roles relationships' });
  }
};

/**
 * GET /api/user-roles/:user_id/:role_id
 * Retrieve a specific relationship by the composite key
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
      // include: { roles: true, users: true } // if you want to include related data
    });

    if (!ur) {
      return res.status(404).json({ error: 'user_role relationship not found' });
    }

    return res.status(200).json(ur);
  } catch (error) {
    console.error('Error in getUserRole:', error);
    return res.status(500).json({ error: 'Failed to retrieve the user_role relationship' });
  }
};

/**
 * POST /api/user-roles
 * Create a new user_role relationship using a DTO
 */
exports.createUserRole = async (req, res) => {
  try {
    // 1. Instantiate the DTO with request data
    const dto = new CreateUserRoleDto(req.body);

    // 2. Validate fields (throws error if invalid)
    dto.validate();

    // 3. Use dto fields to create the relationship
    const newUR = await prisma.user_roles.create({
      data: {
        user_id: Number(dto.user_id),
        role_id: Number(dto.role_id)
      }
    });

    return res.status(201).json(newUR);
  } catch (error) {
    console.error('Error in createUserRole:', error);

    // If this relationship already exists (composite key duplicated), Prisma throws error code P2002
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'This user_id-role_id relationship already exists' });
    }
    // If it's a foreign key error (P2003), user_id or role_id doesn't exist in the respective tables
    if (error.code === 'P2003') {
      return res.status(400).json({ error: 'Foreign key violation: user_id or role_id does not exist' });
    }
    // If the error is from dto.validate() or anything else, respond accordingly
    return res.status(400).json({ error: error.message });
  }
};

/**
 * PUT /api/user-roles/:user_id/:role_id
 * Update a user_role relationship
 * (Since it’s a composite primary key, you can’t edit it directly; we do delete + create)
 */
exports.updateUserRole = async (req, res) => {
  try {
    const { user_id, role_id } = req.params;
    const { new_user_id, new_role_id } = req.body;

    // Check if the current relationship exists
    const existingUR = await prisma.user_roles.findUnique({
      where: {
        user_id_role_id: {
          user_id: Number(user_id),
          role_id: Number(role_id)
        }
      }
    });
    if (!existingUR) {
      return res.status(404).json({ error: 'user_role relationship not found' });
    }

    // If we want to "move" the relationship to (new_user_id, new_role_id),
    // we delete the current one and create a new one.
    if (new_user_id || new_role_id) {
      // Delete the current relationship
      await prisma.user_roles.delete({
        where: {
          user_id_role_id: {
            user_id: Number(user_id),
            role_id: Number(role_id)
          }
        }
      });

      // Create the new relationship
      const newUR = await prisma.user_roles.create({
        data: {
          user_id: new_user_id ? Number(new_user_id) : Number(user_id),
          role_id: new_role_id ? Number(new_role_id) : Number(role_id)
        }
      });

      return res.status(200).json(newUR);
    }

    // If there's no change in the composite key, there's nothing to update
    return res.status(200).json(existingUR);
  } catch (error) {
    console.error('Error in updateUserRole:', error);
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'The new relationship already exists' });
    }
    if (error.code === 'P2003') {
      return res.status(400).json({ error: 'Foreign key violation: user_id or role_id do not exist' });
    }
    return res.status(500).json({ error: 'Failed to update the user_role relationship' });
  }
};

/**
 * DELETE /api/user-roles/:user_id/:role_id
 * Delete a user_role relationship
 */
exports.deleteUserRole = async (req, res) => {
  try {
    const { user_id, role_id } = req.params;

    // Check if it exists
    const existingUR = await prisma.user_roles.findUnique({
      where: {
        user_id_role_id: {
          user_id: Number(user_id),
          role_id: Number(role_id)
        }
      }
    });
    if (!existingUR) {
      return res.status(404).json({ error: 'user_role relationship not found' });
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
    console.error('Error in deleteUserRole:', error);
    return res.status(500).json({ error: 'Failed to delete the user_role relationship' });
  }
};
