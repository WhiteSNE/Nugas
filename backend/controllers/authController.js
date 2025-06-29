const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const path = require('path');

const generateToken = (id, role, name) => {
  return jwt.sign({ id, role, name }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// ... fungsi preRegister dan verifyEmail Anda (tidak berubah)
exports.preRegister = async (req, res) => { /* ... kode Anda ... */ };
exports.verifyEmail = async (req, res) => { /* ... kode Anda ... */ };


// @desc    Login a user
// @route   POST /api/auth/login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      return res.status(401).json({ message: 'Email atau password salah.' });
    }

    if(user.status !== 'active') {
        return res.status(403).json({ message: 'Akun belum aktif. Silakan verifikasi email Anda.' });
    }

    const isMatch = await user.isValidPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Email atau password salah.' });
    }
    
    const token = generateToken(user.id, user.role, user.name);
    
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 hari
    });

    return res.redirect('http://localhost:5173/admin/dashboard')

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


// @desc    Get current user profile
// @route   GET /api/auth/profile
exports.getProfile = async (req, res) => {
  console.log('[getProfile] req.cookies.token:', req.cookies.token);
  console.log('[getProfile] req.user:', req.user);
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  return res.json({
    id: req.user.id,
    email: req.user.email,
    role: req.user.role,
    name: req.user.name
  });
};
