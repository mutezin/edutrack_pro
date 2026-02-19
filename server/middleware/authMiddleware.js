const { verifyToken } = require('../utils/jwt');

// Auth middleware to verify JWT token
exports.authenticate = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token verification failed' });
  }
};

// Authorize specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden - Insufficient permissions' });
    }

    next();
  };
};

// Check if user is admin
exports.isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

// Check if user is teacher
exports.isTeacher = (req, res, next) => {
  if (!req.user || req.user.role !== 'teacher') {
    return res.status(403).json({ message: 'Teacher access required' });
  }
  next();
};

// Check if user is parent
exports.isParent = (req, res, next) => {
  if (!req.user || req.user.role !== 'parent') {
    return res.status(403).json({ message: 'Parent access required' });
  }
  next();
};
