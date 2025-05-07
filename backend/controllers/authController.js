const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'MY_SUPER_SECURE_SECRET';

/**
 * Register a new user
 * Expects: { name, dni, email, password }
 */
exports.register = async (req, res) => {
  try {
    const { name, dni, email, password } = req.body;

    // 1. Basic validation
    if (!dni || !password) {
      return res.status(400).json({ error: 'Missing DNI or password' });
    }

    // 2. Check if the DNI or email is already in use
    const existingUser = await prisma.users.findFirst({
      where: {
        OR: [
          { dni },
          { email }
        ]
      }
    });
    if (existingUser) {
      return res.status(409).json({ error: 'DNI or email already in use' });
    }

    // 3. Encrypt the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Create the user in the 'users' table, including dni
    const newUser = await prisma.users.create({
      data: {
        name,
        dni,
        email,
        password: hashedPassword
      }
    });

    // 5. Assign the 'Patient' role by default to the new user
    const defaultRole = await prisma.roles.findUnique({
      where: { role_name: 'Patient' }
    });

    if (defaultRole) {
      await prisma.user_roles.create({
        data: {
          user_id: newUser.user_id,
          role_id: defaultRole.role_id
        }
      });
    }

    // 6. Return a success response
    return res.status(201).json({
      message: 'User registered successfully',
      user: {
        user_id: newUser.user_id,
        name: newUser.name,
        dni: newUser.dni,
        email: newUser.email
      }
    });
  } catch (error) {
    console.error('Error in register:', error);
    return res.status(500).json({ error: 'Failed to register user' });
  }
};

/**
 * Login a user
 * Expects: { dni, password }
 * Returns: { token, user }
 */
exports.login = async (req, res) => {
  try {
    const { dni, password } = req.body;

    // 1. Basic validation
    if (!dni || !password) {
      return res.status(400).json({ error: 'Missing DNI or password' });
    }

    // 2. Find user by DNI
    const user = await prisma.users.findUnique({
      where: { dni }
    });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // 3. Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // 4. Fetch the user's roles
    const userRoles = await prisma.user_roles.findMany({
      where: { user_id: user.user_id },
      include: { roles: true }
    });
    const roleNames = userRoles.map(ur => ur.roles.role_name);

    // 5. Create JWT payload
    const payload = {
      userId: user.user_id,
      dni: user.dni,
      roles: roleNames
    };

    // 6. Sign the token
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

    // 7. Return the token and user info
    return res.status(200).json({
      token,
      user: {
        user_id: user.user_id,
        name: user.name,
        dni: user.dni,
        email: user.email,
        roles: roleNames
      }
    });
  } catch (error) {
    console.error('Error in login:', error);
    return res.status(500).json({ error: 'Failed to login' });
  }
};

/**
 * Get the profile of the current user
 * Requires an authMiddleware that sets req.user
 */
exports.getProfile = async (req, res) => {
  try {
    const userId = Number(req.user?.userId);
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const userProfile = await prisma.users.findUnique({
      where: { user_id: userId },
      select: {
        user_id: true,
        name: true,
        dni: true,
        email: true,
        user_roles: {
          include: { roles: true }
        }
      }
    });

    if (!userProfile) {
      return res.status(404).json({ error: 'User not found' });
    }

    const roleNames = userProfile.user_roles.map(ur => ur.roles.role_name);

    return res.status(200).json({
      user_id: userProfile.user_id,
      name: userProfile.name,
      dni: userProfile.dni,
      email: userProfile.email,
      roles: roleNames
    });
  } catch (error) {
    console.error('Error in getProfile:', error);
    return res.status(500).json({ error: 'Failed to retrieve profile' });
  }
};
