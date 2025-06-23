const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const PreRegistration = require('../models/PreRegistration');
const { User } = require('../models/User');

// GET total pre-registrations
router.get('/total', async (req, res) => {
  try {
    const total = await PreRegistration.count();
    res.json({ total });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST new pre-registration
router.post('/', async (req, res) => {
  const { email } = req.body;

  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  try {
    // Check for duplicates
    const existing = await PreRegistration.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    // Create new pre-registration
    await PreRegistration.create({ email });
    const total = await PreRegistration.count();
    
    res.json({ total, message: 'Pre-registration successful' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint to move pre-registrations to users
router.post('/convert-to-users', async (req, res) => {
  try {
    // Get all verified pre-registrations
    const preRegistrations = await PreRegistration.findAll();
    
    for (const preReg of preRegistrations) {
      // Skip if email already exists
      const userExists = await User.findOne({ where: { email: preReg.email } });
      if (userExists) continue;
      
      // Create user with default password
      await User.create({
        email: preReg.email,
        name: preReg.email.split('@')[0], // Default name
        password: 'TempPassword123!', // Will be hashed
        role: 'client',
        status: 'active'
      });
    }

    res.json({ message: 'Pre-registrations converted to users' });
  } catch (error) {
    console.error('Conversion error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;