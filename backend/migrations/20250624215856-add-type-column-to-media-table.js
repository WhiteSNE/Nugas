'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('media', 'type', {
      type: Sequelize.ENUM('gallery', 'banner', 'content'),
      allowNull: false,
      defaultValue: 'gallery',
      after: 'status'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('media', 'type');
  }
};