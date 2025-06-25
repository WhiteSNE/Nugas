const User = require('../models/User');
const PreRegistration = require('../models/PreRegistration');
const { Op } = require('sequelize');

// @desc    Get dashboard statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getStats = async (req, res) => {
  try {
    const userCount = await User.count();
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
// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] }, // Don't send passwords
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error('Error fetching all users:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getAllPreRegistrations = async (req, res) => {
  try {
    const registrations = await PreRegistration.findAll({
      where: { status: 'pending' },
      order: [['created_at', 'DESC']]
    });

    res.json({
      success: true,
      data: registrations
    });
  } catch (error) {
    console.error('Error fetching pre-registrations:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


// @desc    Update user role or status
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { role, status } = req.body;

  try {
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (role) user.role = role;
    if (status) user.status = status;

    await user.save();

    res.status(200).json({ message: 'User updated successfully', user });
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await user.destroy();
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.adminResetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res.status(400).json({ message: 'Email dan password baru wajib diisi.' });
  }

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: 'User tidak ditemukan.' });

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password berhasil direset.' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server.' });
  }
};
