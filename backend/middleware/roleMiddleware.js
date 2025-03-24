// middleware/roleMiddleware.js

module.exports = function(allowedRoles) {
    return (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
  
      // Check if the user's roles array intersects with the allowed roles
      const userRoles = req.user.roles || [];
      const hasAtLeastOneRole = userRoles.some((role) => allowedRoles.includes(role));
  
      if (!hasAtLeastOneRole) {
        return res.status(403).json({ error: 'Forbidden: insufficient role' });
      }
  
      next();
    };
  };
  