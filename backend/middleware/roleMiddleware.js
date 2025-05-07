// backend/src/middleware/roleMiddleware.js

/**
 * authorizeRoles: restringe acceso a usuarios cuyos roles
 * intersecten con allowedRoles (case-insensitive).
 *
 * Puede llamarse como:
 *   authorizeRoles('Doctor','Admin')
 * o bien:
 *   authorizeRoles(['Doctor','Admin'])
 */
  module.exports = function authorizeRoles(...allowedRoles) {
  // Si el primer argumento es un array, desempaquétalo:
  if (allowedRoles.length === 1 && Array.isArray(allowedRoles[0])) {
    allowedRoles = allowedRoles[0];
  }

  // Normaliza todos los roles permitidos a minúsculas
  const allowed = allowedRoles.map(r => r.toLowerCase());

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Normaliza roles del usuario
    const userRoles = (req.user.roles || []).map(r => r.toLowerCase());

    // DEBUG (opcional):
    console.log('🔐 authorizeRoles: allowed=', allowed, 'userRoles=', userRoles);

    // Comprueba intersección
    const ok = userRoles.some(r => allowed.includes(r));
    if (!ok) {
      console.log('⛔ authorizeRoles: acceso denegado');
      return res.status(403).json({ error: 'Forbidden: insufficient role' });
    }

    console.log('✔ authorizeRoles: acceso permitido');
    next();
  };
};
