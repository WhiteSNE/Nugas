const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  let token;
  console.log('[protect] cookies:', req.cookies);
  console.log('[protect] token:', req.cookies.token);
  
  if (req.cookies.token) {
    token = req.cookies.token;
  }
  else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findByPk(decoded.id, {
      attributes: { exclude: ['password'] }
    });
    
    if(!req.user) {
        return res.status(401).json({ message: 'User not found' });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: `User role '${req.user.role}' is not authorized` });
    }
    next();
  };
};