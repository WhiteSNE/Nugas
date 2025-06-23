// Ganti isi file: middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware untuk melindungi routes
exports.protect = async (req, res, next) => {
  let token;
  console.log('[protect] cookies:', req.cookies);
  console.log('[protect] token:', req.cookies.token);
  
  // 1. Coba ambil token dari cookie
  if (req.cookies.token) {
    token = req.cookies.token;
  }
  // 2. Jika tidak ada, coba dari header (untuk testing via Postman)
  else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    // Verifikasi token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Dapatkan user dari token dan tambahkan ke object request
    req.user = await User.findByPk(decoded.id, {
      attributes: { exclude: ['password'] } // Jangan kirim password
    });
    
    if(!req.user) {
        return res.status(401).json({ message: 'User not found' });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

// Middleware untuk otorisasi (sudah benar, tidak perlu diubah)
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: `User role '${req.user.role}' is not authorized` });
    }
    next();
  };
};