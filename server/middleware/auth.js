const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - verify token
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'imovies_super_secure_jwt_secret_capstone_2026_xyz'
      );

      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        return res.status(401).json({ success: false, message: 'User not found or deleted' });
      }

      if (!user.isActive) {
        return res.status(403).json({ success: false, message: 'Your account has been deactivated. Please contact support.' });
      }

      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Not authorized, token invalid or expired' });
    }
  } else {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }
};

// Grant access to specific roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user ? req.user.role : 'unauthenticated'}' is not authorized to access this resource`
      });
    }
    next();
  };
};

module.exports = { protect, authorize };

