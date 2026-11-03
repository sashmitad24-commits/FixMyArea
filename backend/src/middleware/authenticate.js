const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const authorization = req.headers.authorization || '';
  const [scheme, token] = authorization.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Please sign in to continue.' });
  }
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    return res.status(503).json({ message: 'Authentication is not configured on the server.' });
  }

  try {
    const claims = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
    if (typeof claims.sub !== 'string' || !['user', 'admin'].includes(claims.role)) {
      return res.status(401).json({ message: 'Your session is invalid. Please sign in again.' });
    }
    req.user = { id: claims.sub, role: claims.role };
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Your session is invalid or has expired. Please sign in again.' });
  }
};

const requireAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Administrator access is required.' });
  }
  return next();
};

module.exports = { authenticate, requireAdmin };
