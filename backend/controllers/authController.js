const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// It's good practice to store your secret in an environment variable
const JWT_SECRET = process.env.JWT_SECRET || 'MY_SUPER_SECURE_SECRET';

/**
 * Register a new user
 * Expects: { email, password, name }
 */
exports.register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // 1. Basic validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Missing email or password' });
    }

    // 2. Check if the email is already in use
    const existingUser = await prisma.users.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already in use' });
    }

    // 3. Encrypt the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Create the user in the 'users' table
    const newUser = await prisma.users.create({
      data: {
        email,
        password: hashedPassword,
        name
      }
    });

    // 5. Assign the 'Patient' role by default to the new user
    const defaultRole = await prisma.roles.findUnique({
      where: { role_name: 'Patient' }
    });

    if (!defaultRole) {
      console.error('Role "Patient" not found in the "roles" table.');
      // You could return an error response or just ignore this part
    } else {
      // Insert the relationship into user_roles
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
      userId: newUser.user_id,
      email: newUser.email
    });
  } catch (error) {
    console.error('Error in register:', error);
    return res.status(500).json({ error: 'Failed to register user' });
  }
};

/**
 * Login a user
 * Expects: { email, password }
 * Returns: { token }
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Basic validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Missing email or password' });
    }

    // 2. Find user by email
    const user = await prisma.users.findUnique({
      where: { email }
    });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // 3. Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // 4. Fetch the user's roles from user_roles (with included roles table)
    const userRoles = await prisma.user_roles.findMany({
      where: { user_id: user.user_id },
      include: { roles: true } // to access roles.role_name
    });

    // Extract role names, e.g. ["Patient", "Doctor", "Admin"]
    const roleNames = userRoles.map((ur) => ur.roles.role_name);

    // 5. Create JWT payload, including roles
    const payload = {
      userId: user.user_id,
      email: user.email,
      roles: roleNames
    };

    // 6. Sign the token
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

    // 7. Return the token
    return res.status(200).json({ token });
  } catch (error) {
    console.error('Error in login:', error);
    return res.status(500).json({ error: 'Failed to login' });
  }
};

/**
 * (Optional) Get the profile of the current user
 * This requires an authMiddleware to have set req.user
 */
exports.getProfile = async (req, res) => {
  try {
    const userId = Number(req.user?.userId); 
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Fetch user plus their roles in a single query
    const userProfile = await prisma.users.findUnique({
      where: { user_id: userId },
      select: {
        user_id: true,
        name: true,
        email: true,
        // Include user_roles and, within that, include the roles table
        user_roles: {
          include: {
            roles: true
          }
        }
      }
    });

    if (!userProfile) {
      return res.status(404).json({ error: 'User not found' });
    }

    // user_roles is an array; each entry has .roles with a .role_name
    // Map them to get an array of role names (e.g. ["Doctor", "Admin"])
    const roleNames = userProfile.user_roles.map((ur) => ur.roles.role_name);

    // Return user info + roles array
    return res.status(200).json({
      user_id: userProfile.user_id,
      name: userProfile.name,
      email: userProfile.email,
      roles: roleNames
    });
  } catch (error) {
    console.error('Error in getProfile:', error);
    return res.status(500).json({ error: 'Failed to retrieve profile' });
  }
};