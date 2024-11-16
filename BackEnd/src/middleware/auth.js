const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id);
      return next();
    } catch (error) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  }

  if (req.isAuthenticated()) {
    req.user = req.user;  
    return next();
  }
  return res.status(401).json({ message: 'Unauthorized' });
};

module.exports = authMiddleware;
