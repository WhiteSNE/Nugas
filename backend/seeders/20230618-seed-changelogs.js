'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('changelogs', [
      {
        title: 'Initial Release',
        category: 'announcement',
        content: 'Our first release is live! 🎉',
        user_id: 1, // Pastikan user dengan ID 1 ada
        created_at: new Date()
      },
      {
        title: 'Fixed Login Bug',
        category: 'bugfix',
        content: 'Resolved an issue where users couldn\'t log in using Google OAuth.',
        user_id: 1,
        created_at: new Date()
      },
      {
        title: 'Weekly Maintenance',
        category: 'maintenance',
        content: 'Performed routine database optimization and cleanup.',
        user_id: 1,
        created_at: new Date()
      },
      {
        title: 'Dark Mode Update',
        category: 'update',
        content: 'Added full dark mode support across all pages.',
        user_id: 1,
        created_at: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('changelogs', null, {});
  }
};
