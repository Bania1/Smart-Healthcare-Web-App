// controllers/usersController.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * GET /api/users
 * Obtener todos los usuarios
 */
exports.getAllUsers = async (req, res) => {
  try {
    // Busca todos los registros en la tabla "users"
    const allUsers = await prisma.users.findMany();
    return res.status(200).json(allUsers);
  } catch (error) {
    console.error('Error en getAllUsers:', error);
    return res.status(500).json({ error: 'Error al obtener los usuarios' });
  }
};

/**
 * GET /api/users/:id
 * Obtener un usuario por ID
 */
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    // user_id es la primary key en tu modelo "users"
    const user = await prisma.users.findUnique({
      where: { user_id: Number(id) },
      // include: { users_details: true } // Descomenta si quieres traer detalles relacionados
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error('Error en getUserById:', error);
    return res.status(500).json({ error: 'Error al obtener el usuario' });
  }
};

/**
 * POST /api/users
 * Crear un nuevo usuario
 */
exports.createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Ejemplo de validación mínima:
    if (!email || !password) {
      return res.status(400).json({ error: 'Faltan campos obligatorios (email, password)' });
    }

    // Si deseas encriptar la contraseña, podrías usar bcrypt aquí
    // const salt = await bcrypt.genSalt(10);
    // const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await prisma.users.create({
      data: {
        name,
        email,
        password, // o hashedPassword si encriptas
      },
    });

    return res.status(201).json(newUser);
  } catch (error) {
    console.error('Error en createUser:', error);
    return res.status(500).json({ error: 'Error al crear el usuario' });
  }
};

/**
 * PUT /api/users/:id
 * Actualizar un usuario
 */
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password } = req.body;

    // Verificar si existe
    const existingUser = await prisma.users.findUnique({
      where: { user_id: Number(id) },
    });
    if (!existingUser) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Si quieres encriptar la contraseña, hazlo aquí antes del update
    // if (password) {
    //   const salt = await bcrypt.genSalt(10);
    //   req.body.password = await bcrypt.hash(password, salt);
    // }

    const updatedUser = await prisma.users.update({
      where: { user_id: Number(id) },
      data: { name, email, password },
    });

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error en updateUser:', error);
    return res.status(500).json({ error: 'Error al actualizar el usuario' });
  }
};

/**
 * DELETE /api/users/:id
 * Eliminar un usuario
 */
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar si existe
    const existingUser = await prisma.users.findUnique({
      where: { user_id: Number(id) },
    });
    if (!existingUser) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    await prisma.users.delete({ where: { user_id: Number(id) } });
    return res.status(204).send(); // No Content
  } catch (error) {
    console.error('Error en deleteUser:', error);
    return res.status(500).json({ error: 'Error al eliminar el usuario' });
  }
};
