// controllers/usersController.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const CreateUserDto = require('../dtos/createUser.dto');

/**
 * GET /api/users
 * Retrieve all users (con array de roles)
 */
exports.getAllUsers = async (req, res) => {
  try {
    const allUsers = await prisma.users.findMany({
      include: {
        user_roles: {
          include: { roles: true }
        }
      }
    });

    // Formateamos cada usuario para devolver { user_id, name, dni, email, roles: [ 'Doctor', ... ] }
    const formatted = allUsers.map(u => ({
      user_id: u.user_id,
      name:    u.name,
      dni:     u.dni,
      email:   u.email,
      roles:   u.user_roles.map(ur => ur.roles.role_name)
    }));

    return res.status(200).json(formatted);
  } catch (error) {
    console.error('Error in getAllUsers:', error);
    return res.status(500).json({ error: 'Failed to retrieve users' });
  }
};

/**
 * GET /api/users/:id
 */
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await prisma.users.findUnique({
      where: { user_id: Number(id) },
      include: {
        user_roles: { include: { roles: true } }
      }
    });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    // Formateamos igual que en getAllUsers
    const formatted = {
      user_id: user.user_id,
      name:    user.name,
      dni:     user.dni,
      email:   user.email,
      roles:   user.user_roles.map(ur => ur.roles.role_name)
    };
    return res.status(200).json(formatted);
  } catch (error) {
    console.error('Error in getUserById:', error);
    return res.status(500).json({ error: 'Failed to retrieve user' });
  }
};

/**
 * POST /api/users
 */
exports.createUser = async (req, res) => {
  try {
    const dto = new CreateUserDto(req.body);
    dto.validate();

    const newUser = await prisma.users.create({
      data: {
        name:     dto.name,
        email:    dto.email,
        password: dto.password
      }
    });
    return res.status(201).json(newUser);
  } catch (error) {
    console.error('Error in createUser:', error);
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'Email already in use' });
    }
    return res.status(400).json({ error: error.message });
  }
};

/**
 * PUT /api/users/:id
 */
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password } = req.body;

    const existingUser = await prisma.users.findUnique({
      where: { user_id: Number(id) }
    });
    if (!existingUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    const updatedUser = await prisma.users.update({
      where: { user_id: Number(id) },
      data: { name, email, password }
    });
    return res.status(200).json(updatedUser);

  } catch (error) {
    console.error('Error in updateUser:', error);
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'Email already in use' });
    }
    return res.status(500).json({ error: 'Failed to update user' });
  }
};

/**
 * DELETE /api/users/:id
 */
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const existingUser = await prisma.users.findUnique({
      where: { user_id: Number(id) }
    });
    if (!existingUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    await prisma.users.delete({
      where: { user_id: Number(id) }
    });
    return res.status(204).send();
  } catch (error) {
    console.error('Error in deleteUser:', error);
    return res.status(500).json({ error: 'Failed to delete user' });
  }
};

/**
 * GET /api/users/search
 * Query params: ?role=Patient|Doctor&q=text
 */
exports.searchUsers = async (req, res) => {
  try {
    let { role, q } = req.query;

    // 1) Must have role
    if (!role) {
      return res.status(400).json({ error: 'Se requiere role' });
    }

    // 2) Default empty q → match all
    q = q || '';

    // 3) Normalize role
    const roleName =
      role.toLowerCase() === 'doctor'
        ? 'Doctor'
        : role.toLowerCase() === 'admin'
        ? 'Admin'
        : 'Patient';

    // 4) Query for users with that role, whose name or dni contains q
    const users = await prisma.users.findMany({
      where: {
        AND: [
          { user_roles: { some: { roles: { role_name: roleName } } } },
          {
            OR: [
              { name: { contains: q, mode: 'insensitive' } },
              { dni:  { contains: q, mode: 'insensitive' } }
            ]
          }
        ]
      },
      take: 10,
      select: { user_id: true, name: true, dni: true }
    });

    return res.json(users);
  } catch (err) {
    console.error('Error in searchUsers:', err);
    return res.status(500).json({ error: 'Error al buscar usuarios' });
  }
};



// /**
//  * GET /api/users/search
//  * Query params: ?role=Patient|Doctor&q=text
//  */
// exports.searchUsers = async (req, res) => {
//   try {
//     const { role, q } = req.query;
//     if (!role || !q) {
//       return res.status(400).json({ error: 'Se requiere role y q' });
//     }
//     const roleName = role.toLowerCase() === 'doctor' ? 'Doctor' : 'Patient';
//     const users = await prisma.users.findMany({
//       where: {
//         AND: [
//           { user_roles: { some: { roles: { role_name: roleName } } } },
//           {
//             OR: [
//               { name:  { contains: q, mode: 'insensitive' } },
//               { dni:   { contains: q, mode: 'insensitive' } }
//             ]
//           }
//         ]
//       },
//       take: 10,
//       select: { user_id: true, name: true, dni: true }
//     });
//     return res.json(users);
//   } catch (err) {
//     console.error('Error in searchUsers:', err);
//     return res.status(500).json({ error: 'Error al buscar usuarios' });
//   }
// };
