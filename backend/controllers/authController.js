// Ganti isi file: controllers/authController.js

const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

// Utility untuk generate JWT dengan data lebih kaya
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
    
    // Buat token dengan menyertakan role dan name
    const token = generateToken(user.id, user.role, user.name);
    
    // ATUR TOKEN DI COOKIE
    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 hari
    });

    // Kirim respons sukses tanpa token di body
    res.status(200).json({ 
        message: 'Login berhasil',
        user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


// @desc    Get current user profile
// @route   GET /api/auth/profile
exports.getProfile = async (req, res) => {
  console.log('[getProfile] req.cookies.token:', req.cookies.token);
  console.log('[getProfile] req.user:', req.user); // dari protect middleware
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
