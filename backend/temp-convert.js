// temp-convert.js
const { Sequelize } = require('sequelize');
const config = require('./config/config.json'); // Make sure this path is correct

// Create a new Sequelize instance
const sequelize = new Sequelize(config.development);

// Import models
const PreRegistration = require('./models/PreRegistration');
const User = require('./models/User');

async function convertPreRegistrations() {
  try {
    // Authenticate with the database
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    // Sync models with database
    await sequelize.sync();
    console.log('Database models synchronized.');
    
    // Get all pre-registrations
    const preRegistrations = await PreRegistration.findAll();
    console.log(`Found ${preRegistrations.length} pre-registrations.`);
    
    let createdCount = 0;
    for (const preReg of preRegistrations) {
      // Check if user already exists
      const userExists = await User.findOne({ where: { email: preReg.email } });
      if (userExists) {
        console.log(`User with email ${preReg.email} already exists. Skipping.`);
        continue;
      }
      
      // Create new user
      await User.create({
        email: preReg.email,
        name: preReg.email.split('@')[0], // Generate name from email
        password: 'TempPassword123!', // Temporary password
        role: 'client',
        status: 'active'
      });
      
      createdCount++;
      console.log(`Created user for: ${preReg.email}`);
    }
    
    console.log(`Successfully created ${createdCount} users.`);
    process.exit(0);
  } catch (error) {
    console.error('Conversion failed:', error);
    process.exit(1);
  }
}

// Run the conversion
convertPreRegistrations();