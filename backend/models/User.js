// users.js (Servicio para la tabla "users" con Prisma)

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');

/**
 * Servicio "User" para interactuar con la tabla "users" definida en schema.prisma.
 * Este archivo sustituye al modelo de Sequelize y gestiona la lógica (por ejemplo, hashing de contraseñas).
 */
const User = {
  /**
   * Crear un usuario nuevo en la tabla "users"
   * @param {Object} data - { name, email, password, ... }
   */
  async create(data) {
    // Encriptar la contraseña antes de guardar
    if (data.password) {
      const salt = await bcrypt.genSalt(10);
      data.password = await bcrypt.hash(data.password, salt);
    }
    // Inserta en la tabla "users"
    return prisma.users.create({ data });
  },

  /**
   * Buscar un usuario por su ID (user_id)
   * @param {number} userId
   * @param {boolean} withPassword - Si quieres incluir la contraseña en el objeto devuelto
   */
  async findById(userId, withPassword = false) {
    const user = await prisma.users.findUnique({
      where: { user_id: Number(userId) },
    });
    if (!user) return null;

    // Por defecto, ocultamos la contraseña
    if (!withPassword) {
      const { password, ...rest } = user;
      return rest;
    }
    return user;
  },

  /**
   * Buscar un usuario por su email
   * @param {string} email
   * @param {boolean} withPassword - Si quieres incluir la contraseña
   */
  async findByEmail(email, withPassword = false) {
    const user = await prisma.users.findUnique({ where: { email } });
    if (!user) return null;

    if (!withPassword) {
      const { password, ...rest } = user;
      return rest;
    }
    return user;
  },

  /**
   * Listar todos los usuarios
   * (Por defecto, no devolvemos la contraseña)
   */
  async findAll() {
    const users = await prisma.users.findMany();
    // Retirar la contraseña de cada registro
    return users.map(({ password, ...rest }) => rest);
  },

  /**
   * Actualizar un usuario por ID
   * @param {number} userId
   * @param {Object} data - { name, email, password, ... }
   */
  async update(userId, data) {
    // Si viene nueva contraseña, la encriptamos
    if (data.password) {
      const salt = await bcrypt.genSalt(10);
      data.password = await bcrypt.hash(data.password, salt);
    }
    return prisma.users.update({
      where: { user_id: Number(userId) },
      data,
    });
  },

  /**
   * Eliminar un usuario por ID
   * @param {number} userId
   */
  async delete(userId) {
    return prisma.users.delete({
      where: { user_id: Number(userId) },
    });
  },

  /**
   * Comparar contraseña en texto plano con la contraseña hasheada
   * @param {Object} user - Objeto usuario que incluya user.password
   * @param {string} plainPassword - Contraseña en texto plano
   * @returns {boolean} true si coincide, false en caso contrario
   */
  async comparePassword(user, plainPassword) {
    return bcrypt.compare(plainPassword, user.password);
  },
};

module.exports = User;
