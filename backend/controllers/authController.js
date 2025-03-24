// controllers/authController.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// It's good practice to store your secret in an environment variable
const JWT_SECRET = process.env.JWT_SECRET || 'MY_SUPER_SECURE_SECRET';

/**
 * Register a new user
 * Expects: { email, password, name? }
 */
exports.register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Missing email or password' });
    }

    // Check if email already in use
    const existingUser = await prisma.users.findUnique({
      where: { email }
    });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already in use' });
    }

    // Encrypt password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser = await prisma.users.create({
      data: {
        email,
        password: hashedPassword,
        name
      }
    });

    // Optionally, return a success message or a token
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

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Missing email or password' });
    }

    // Find user by email
    const user = await prisma.users.findUnique({
      where: { email }
    });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Create JWT payload
    const payload = {
      userId: user.user_id,
      email: user.email
      // If you want to include user roles or name, you can add them here
    };

    // Sign the token
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

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
    // We assume authMiddleware sets req.user = { userId, email, ... }
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Fetch user from DB without password
    const userProfile = await prisma.users.findUnique({
      where: { user_id: userId },
      select: {
        user_id: true,
        name: true,
        email: true
      }
    });

    if (!userProfile) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json(userProfile);
  } catch (error) {
    console.error('Error in getProfile:', error);
    return res.status(500).json({ error: 'Failed to retrieve profile' });
  }
};
