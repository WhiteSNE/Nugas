'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('pre_registrations', 'verification_token', {
      type: Sequelize.STRING,
      allowNull: true
    });
    
    await queryInterface.addColumn('pre_registrations', 'token_expires_at', {
      type: Sequelize.DATE,
      allowNull: true
    });
    
    await queryInterface.addColumn('pre_registrations', 'status', {
      type: Sequelize.ENUM('pending', 'verified'),
      defaultValue: 'pending'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('pre_registrations', 'verification_token');
    await queryInterface.removeColumn('pre_registrations', 'token_expires_at');
    await queryInterface.removeColumn('pre_registrations', 'status');
  }
};