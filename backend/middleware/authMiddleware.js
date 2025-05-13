// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'MY_SUPER_SECURE_SECRET';

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Missing Authorization header' });
  }

  // Soportar "Bearer <token>", case-insensitive
  const [scheme, token] = authHeader.split(' ');
  if (!scheme || !token || scheme.toLowerCase() !== 'bearer') {
    return res.status(401).json({
      error: 'Invalid Authorization format. Expected "Bearer <token>"'
    });
  }

  // Verificar token
  jwt.verify(token, JWT_SECRET, (err, payload) => {
    if (err) {
      console.error('JWT verification error:', err);
      // Diferenciar expirado vs inválido
      const message =
        err.name === 'TokenExpiredError'
          ? 'Token expired'
          : 'Invalid token';
      return res.status(401).json({ error: message });
    }

    // Adjuntar datos del usuario al request
    req.user = payload;
    next();
  });
}

module.exports = authMiddleware;
