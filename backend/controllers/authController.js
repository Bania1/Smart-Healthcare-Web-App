const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'MY_SUPER_SECURE_SECRET';

/**
 * Register a new user (Patient or Doctor), plus details and role in one step
 */
exports.register = async (req, res) => {
  try {
    const {
      name,
      dni,
      email,
      password,
      role,            // 'patient' o 'doctor'
      date_of_birth,   // 'YYYY-MM-DD' o null
      contact_info,    // teléfono o null
      specialty,       // solo para doctor
      availability     // solo para doctor
    } = req.body;

    // 1) Validación básica
    if (!name || !dni || !password || !role) {
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

    // 5) Crear detalles
    await prisma.users_details.create({
      data: {
        user_id: newUser.user_id,
        date_of_birth: date_of_birth
          ? new Date(date_of_birth)
          : null,
        contact_info: contact_info  || null,
        specialty: specialty        || null,
        availability: availability  || null
      }
    });

    // 6) Buscar ID del rol solicitado (case‐insensitive)
    const wantedRole = role === 'doctor' ? 'Doctor' : 'Patient';
    const roleRecord = await prisma.roles.findFirst({
      where: {
        role_name: {
          equals: wantedRole,
          mode: 'insensitive'
        }
      }
    });
    if (!roleRecord) {
      return res.status(500).json({ error: `Rol "${wantedRole}" no encontrado` });
    }

    // 7) Asignar rol
    await prisma.user_roles.create({
      data: {
        user_id: newUser.user_id,
        role_id: roleRecord.role_id
      }
    });

    // 8) Responder al cliente
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
    console.error('❌ Error en register:', error.stack || error);
    return res.status(500).json({ error: 'Error interno en el registro' });
  }
};

/**
 * Login a user
 */
exports.login = async (req, res) => {
  try {
    const { dni, password } = req.body;
    if (!dni || !password) {
      return res.status(400).json({ error: 'Missing DNI or password' });
    }

    const user = await prisma.users.findUnique({ where: { dni } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const userRoles = await prisma.user_roles.findMany({
      where: { user_id: user.user_id },
      include: { roles: true }
      include: { roles: true }
    });
    const roleNames = userRoles.map(ur => ur.roles.role_name);

    const token = jwt.sign(
      { userId: user.user_id, dni: user.dni, roles: roleNames },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

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
    console.error('❌ Error in login:', error.stack || error);
    return res.status(500).json({ error: 'Failed to login' });
  }
};

/**
 * Get the current user's profile
 */
exports.getProfile = async (req, res) => {
  try {
    const userId = Number(req.user?.userId);
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
        dni: true,
        email: true,
        user_roles: { include: { roles: true } }
      }
    });
    if (!userProfile) {
      return res.status(404).json({ error: 'User not found' });
    }

    const roleNames = userProfile.user_roles.map(ur => ur.roles.role_name);
    const roleNames = userProfile.user_roles.map(ur => ur.roles.role_name);

    return res.status(200).json({
      user_id: userProfile.user_id,
      name: userProfile.name,
      dni: userProfile.dni,
      email: userProfile.email,
      roles: roleNames
    });
  } catch (error) {
    console.error('❌ Error in getProfile:', error.stack || error);
    return res.status(500).json({ error: 'Failed to retrieve profile' });
  }
};

