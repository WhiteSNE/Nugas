// File: backend/controllers/adminController.js

const User = require('../models/User');
const PreRegistration = require('../models/PreRegistration');

// @desc    Get dashboard statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getStats = async (req, res) => {
  try {
    // Menghitung jumlah semua user yang terdaftar
    const userCount = await User.count();

    // Menghitung jumlah pra-registrasi yang masih pending
    const preRegCount = await PreRegistration.count({
      where: { status: 'pending' }
    });

    res.status(200).json({
      users: userCount,
      registrations: preRegCount
    });

  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};