// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'MY_SUPER_SECURE_SECRET';

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const [bearer, token] = authHeader.split(' ');
    if (bearer !== 'Bearer' || !token) {
      return res.status(401).json({ error: 'Invalid token format' });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Attach the user info (claims) to req.user
    req.user = decoded;

    next();
  } catch (error) {
    console.error('Error in authMiddleware:', error);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

module.exports = authMiddleware;
