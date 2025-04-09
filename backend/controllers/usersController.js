// controllers/usersController.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


const CreateUserDto = require('../dtos/createUser.dto');

/**
 * GET /api/users
 * Retrieve all users
 */
exports.getAllUsers = async (req, res) => {
  try {
    const allUsers = await prisma.users.findMany();
    return res.status(200).json(allUsers);
  } catch (error) {
    console.error('Error in getAllUsers:', error);
    return res.status(500).json({ error: 'Failed to retrieve users' });
  }
};

/**
 * GET /api/users/:id
 * Retrieve a user by ID
 */
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await prisma.users.findUnique({
      where: { user_id: Number(id) },
      
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error('Error in getUserById:', error);
    return res.status(500).json({ error: 'Failed to retrieve user' });
  }
};

/**
 * POST /api/users
 * Create a new user using a DTO
 */
exports.createUser = async (req, res) => {
  try {
    // 1. Instantiate the DTO with request data
    const dto = new CreateUserDto(req.body);

    // 2. Validate the data (throws an error if invalid)
    dto.validate();

    // 3. Use dto fields (dto.email, dto.password, etc.) to create the user
    const newUser = await prisma.users.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: dto.password,
      },
    });

    return res.status(201).json(newUser);
  } catch (error) {
    console.error('Error in createUser:', error);

    // Handle specific Prisma errors
    if (error.code === 'P2002') {
      // Unique constraint (e.g., duplicate email)
      return res.status(409).json({ error: 'Email already in use' });
    }

    // If the error is from dto.validate() or anything else, return 400
    return res.status(400).json({ error: error.message });
  }
};

/**
 * PUT /api/users/:id
 * Update a user
 */
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password } = req.body;

    // Check if the user exists
    const existingUser = await prisma.users.findUnique({
      where: { user_id: Number(id) },
    });
    if (!existingUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    try {
      const updatedUser = await prisma.users.update({
        where: { user_id: Number(id) },
        data: { name, email, password },
      });
      return res.status(200).json(updatedUser);
    } catch (updateError) {
      console.error('Error in updateUser (Prisma):', updateError);

      if (updateError.code === 'P2002') {
        // Duplicate email or another unique constraint
        return res.status(409).json({ error: 'Email already in use' });
      }

      return res.status(500).json({ error: 'Failed to update user' });
    }
  } catch (error) {
    console.error('Error in updateUser (general):', error);
    return res.status(500).json({ error: 'Internal error while updating user' });
  }
};

/**
 * DELETE /api/users/:id
 * Delete a user
 */
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the user exists
    const existingUser = await prisma.users.findUnique({
      where: { user_id: Number(id) },
    });
    if (!existingUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    await prisma.users.delete({
      where: { user_id: Number(id) },
    });

    return res.status(204).send(); // No Content
  } catch (error) {
    console.error('Error in deleteUser:', error);
    return res.status(500).json({ error: 'Failed to delete user' });
  }
};
