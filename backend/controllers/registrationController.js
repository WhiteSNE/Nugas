const User = require('../models/User');
const PreRegistration = require('../models/PreRegistration');

exports.convertPreRegistrations = async (req, res) => {
  try {
    const preRegistrations = await PreRegistration.findAll();

    let createdCount = 0;
    for (const preReg of preRegistrations) {
      const userExists = await User.findOne({ where: { email: preReg.email } });
      if (userExists) continue;

      await User.create({
        email: preReg.email,
        name: preReg.email.split('@')[0],
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
};

exports.getAllPreRegistrations = async (req, res) => {
  try {
    const data = await PreRegistration.findAll({ attributes: ['email'] });
    res.json({ data });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
