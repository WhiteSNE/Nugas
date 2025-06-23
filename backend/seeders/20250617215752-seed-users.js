'use strict';
const { User } = require('../models');

module.exports = {
  async up(queryInterface, Sequelize) {
    // Clear existing users to avoid duplicate errors
    await queryInterface.bulkDelete('users', null, {});
    console.log('Existing users cleared before seeding.');

    const usersData = [
      {
        email: 'admin@examp.com',
        name: 'Admin Utama',
        password: 'StrongAdminPass123!',
        role: 'admin',
        status: 'active',
        verified_at: new Date()
      },
      {
        email: 'user1@example.com',
        name: 'Pengguna Satu',
        password: 'SecureUserPass123!',
        role: 'client',
        status: 'active',
        verified_at: new Date()
      },
      {
        email: 'user2@example.com',
        name: 'Pengguna Dua',
        password: 'AnotherSecurePass123!',
        role: 'client',
        status: 'pending_verification'
      }
    ];

    try {
      await User.bulkCreate(usersData, { 
        individualHooks: true
      });
      console.log('Users seeded successfully!');
    } catch (error) {
      console.error('Seeding failed:');
      if (error.errors) {
        error.errors.forEach(err => {
          console.error(`- Field: ${err.path}, Error: ${err.message}`);
        });
      } else {
        console.error(error);
      }
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
    console.log('Users table cleared.');
  }
};