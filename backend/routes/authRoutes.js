const express = require('express');
const router = express.Router();

const User = require('../models/User');
const { login, getProfile } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { PreRegistration } = require('../models/PreRegistration');
const crypto = require('crypto');

router.post('/pre-register', async (req, res) => {
  const { email } = req.body;
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  try {
    const existingPreReg = await PreRegistration.findOne({ where: { email } });
    if (existingPreReg) {
      return res.status(409).json({ error: 'Email already pre-registered' });
    }
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already registered' });
    }
    await PreRegistration.create({ email });
    
    res.json({ message: 'Pre-registration successful!' });
  } catch (error) {
    console.error('Pre-registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/request-password-reset', async (req, res) => {
  const { email } = req.body;
  
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date(Date.now() + 3600000);
    
    await user.update({
      reset_token: resetToken,
      reset_expires: resetExpires
    });
    console.log(`Password reset token for ${email}: ${resetToken}`);
    
    res.json({ 
      message: 'Password reset instructions sent',
      resetToken
    });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;
  
  try {
    const user = await User.findOne({
      where: {
        reset_token: token,
        reset_expires: { [Sequelize.Op.gt]: new Date() }
      }
    });
    
    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }
    
    user.password = newPassword;

    await user.save();
    await user.update({
      reset_token: null,
      reset_expires: null
    });
    
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/login', login);
router.get('/profile', protect, getProfile);
router.post('/convert-pre-registrations', protect, authorize('admin'), async (req, res) => {
  try {
    const preRegistrations = await PreRegistration.findAll();
    
    let createdCount = 0;
    for (const preReg of preRegistrations) {
      const userExists = await User.findOne({ where: { email: preReg.email } });
      if (userExists) continue;
      
      await User.create({
        email: preReg.email,
        name: preReg.email.split('@')[0], // Default name
        password: 'TempPassword123!',
        role: 'client',
        status: 'active'
      });
      
      createdCount++;
    }
    
    res.json({ 
      message: `Converted ${createdCount} pre-registrations to user accounts`,
      createdCount
    });
  } catch (error) {
    console.error('Conversion error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/admin/data', protect, authorize('admin'), (req, res) => {
  res.status(200).json({ message: 'Welcome to the admin dashboard!' });
});

module.exports = router;