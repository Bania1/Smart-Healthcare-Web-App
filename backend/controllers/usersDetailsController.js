// controllers/usersDetailsController.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * GET /api/users-details
 * Retrieve all users_details records
 */
exports.getAllUsersDetails = async (req, res) => {
  try {
    const allDetails = await prisma.users_details.findMany({
      // If you want to include data from the "users" table, you can do:
      // include: { users: true }
    });
    return res.status(200).json(allDetails);
  } catch (error) {
    console.error('Error in getAllUsersDetails:', error);
    return res.status(500).json({ error: 'Failed to retrieve users_details' });
  }
};

/**
 * GET /api/users-details/:user_id
 * Retrieve details of a user by user_id
 */
exports.getUserDetailsById = async (req, res) => {
  try {
    const { user_id } = req.params;
    const details = await prisma.users_details.findUnique({
      where: { user_id: Number(user_id) },
      // include: { users: true } // if you want to include "users" data
    });

    if (!details) {
      return res.status(404).json({ error: 'No details found for that user_id' });
    }

    return res.status(200).json(details);
  } catch (error) {
    console.error('Error in getUserDetailsById:', error);
    return res.status(500).json({ error: 'Failed to retrieve user details' });
  }
};

/**
 * POST /api/users-details
 * Create a new users_details record
 */
exports.createUserDetails = async (req, res) => {
  try {
    const { user_id, specialty, availability, date_of_birth, contact_info } = req.body;

    // Basic validations
    if (!user_id) {
      return res.status(400).json({ error: 'Missing user_id (primary key)' });
    }

    // Insert into the table
    const newDetails = await prisma.users_details.create({
      data: {
        user_id: Number(user_id),
        specialty,
        availability,
        date_of_birth: date_of_birth ? new Date(date_of_birth) : null,
        contact_info
      }
    });

    return res.status(201).json(newDetails);
  } catch (error) {
    console.error('Error in createUserDetails:', error);

    // P2002 = unique constraint. Means a users_details record for that user_id already exists
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'A users_details record already exists for that user_id' });
    }
    // P2003 = foreign key constraint. user_id does not exist in "users" table
    if (error.code === 'P2003') {
      return res.status(400).json({ error: 'Foreign key violation: user_id does not exist in the "users" table' });
    }

    return res.status(500).json({ error: 'Failed to create users_details record' });
  }
};

/**
 * PUT /api/users-details/:user_id
 * Update a users_details record
 */
exports.updateUserDetails = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { specialty, availability, date_of_birth, contact_info } = req.body;

    // Check if it exists
    const existingDetails = await prisma.users_details.findUnique({
      where: { user_id: Number(user_id) }
    });
    if (!existingDetails) {
      return res.status(404).json({ error: 'No details found for that user_id' });
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
    console.error('Error in updateUserDetails:', error);
    // For example, invalid date_of_birth or user_id violating constraints
    return res.status(500).json({ error: 'Failed to update user details' });
  }
};

/**
 * DELETE /api/users-details/:user_id
 * Delete a users_details record
 */
exports.deleteUserDetails = async (req, res) => {
  try {
    const { user_id } = req.params;

    // Check if it exists
    const existingDetails = await prisma.users_details.findUnique({
      where: { user_id: Number(user_id) }
    });
    if (!existingDetails) {
      return res.status(404).json({ error: 'No details found for that user_id' });
    }

    await prisma.users_details.delete({
      where: { user_id: Number(user_id) }
    });

    return res.status(204).send(); // No Content
  } catch (error) {
    console.error('Error in deleteUserDetails:', error);
    return res.status(500).json({ error: 'Failed to delete user details' });
  }
};
