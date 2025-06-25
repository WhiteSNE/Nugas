'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('media', 'status', {
      type: Sequelize.ENUM('permanent', 'temporary'),
      allowNull: false,
      defaultValue: 'permanent',
      after: 'path'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('media', 'status');
  }
};