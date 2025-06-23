'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      role: {
        type: Sequelize.ENUM('admin', 'client'),
        allowNull: false,
        defaultValue: 'client'
      },
      status: {
        type: Sequelize.ENUM('pending_verification', 'active', 'suspended'),
        allowNull: false,
        defaultValue: 'pending_verification'
      },
      verification_token: {
        type: Sequelize.STRING,
        allowNull: true
      },
      token_expires_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      verified_at: {
        allowNull: true,
        type: Sequelize.DATE
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};