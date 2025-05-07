// backend/src/controllers/authController.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'MY_SUPER_SECURE_SECRET';

/**
 * Register a new user
 * Expects: { name, dni, email, password, role, date_of_birth, contact_info, specialty, availability }
 */
exports.register = async (req, res) => {
  try {
    const {
      name,
      dni,
      email,
      password,
      role,            // 'patient' o 'doctor'
      date_of_birth,   // YYYY-MM-DD o null
      contact_info,    // teléfono o null
      specialty,       // solo para doctor
      availability     // solo para doctor
    } = req.body;

    // 1) Validación básica
    if (!dni || !password || !name) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    // 2) Comprobar duplicados
    const exists = await prisma.users.findFirst({
      where: { OR: [{ dni }, { email }] }
    });
    if (exists) {
      return res.status(409).json({ error: 'DNI o email ya registrado' });
    }

    // 3) Hashear contraseña
    const hashed = await bcrypt.hash(password, 10);

    // 4) Crear usuario
    const newUser = await prisma.users.create({
      data: { name, dni, email, password: hashed }
    });

    // 5) Crear detalles (siempre)
    await prisma.users_details.create({
      data: {
        user_id: newUser.user_id,
        date_of_birth: date_of_birth
          ? new Date(date_of_birth)
          : null,
        contact_info: contact_info || null,
        specialty: specialty || null,
        availability: availability || null
      }
    });

    // 6) Buscar ID del rol solicitado
    const roleRecord = await prisma.roles.findUnique({
      where: {
        role_name: role === 'doctor' ? 'Doctor' : 'Patient'
      }
    });
    if (!roleRecord) {
      return res.status(500).json({ error: `Rol ${role} no encontrado` });
    }

    // 7) Asignar rol
    await prisma.user_roles.create({
      data: {
        user_id: newUser.user_id,
        role_id: roleRecord.role_id
      }
    });

    // 8) Devolver respuesta (sin token aún)
    return res.status(201).json({
      message: 'Usuario registrado con éxito',
      user: {
        user_id: newUser.user_id,
        name: newUser.name,
        dni: newUser.dni,
        email: newUser.email,
        role: roleRecord.role_name
      }
    });

  } catch (error) {
    console.error('Error en register:', error);
    return res.status(500).json({ error: 'Error interno en el registro' });
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

    // 1. Validación básica
    if (!dni || !password) {
      return res.status(400).json({ error: 'Missing DNI or password' });
    }

    // 2. Buscar usuario por DNI
    const user = await prisma.users.findUnique({
      where: { dni }
    });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // 3. Comparar contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // 4. Obtener roles del usuario
    const userRoles = await prisma.user_roles.findMany({
      where: { user_id: user.user_id },
      include: { roles: true }  // <-- aquí ya forma parte del objeto
    });
    const roleNames = userRoles.map(ur => ur.roles.role_name);

    // 5. Payload del JWT
    const payload = {
      userId: user.user_id,
      dni: user.dni,
      roles: roleNames
    };

    // 6. Firmar token
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

    // 7. Responder con token y datos de usuario
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
 * Requires authMiddleware to have puesto req.user
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
