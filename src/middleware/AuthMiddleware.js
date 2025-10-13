const jwt = require('jsonwebtoken');

class AuthMiddleware {
  static authenticate(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });
    jwt.verify(token, process.env.JWT_SECRET || 'secret', (err, decoded) => {
      if (err) return res.status(403).json({ error: 'Invalid token' });
      req.userId = decoded.userId;
      req.userRole = decoded.role;
      next();
    });
  }
}

module.exports = AuthMiddleware;
