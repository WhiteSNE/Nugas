const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class PreRegistration extends Model {}

PreRegistration.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  verification_token: {
    type: DataTypes.STRING,
    allowNull: true
  },
  token_expires_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('pending', 'verified'),
    defaultValue: 'pending'
  }
}, {
  sequelize,
  modelName: 'PreRegistration',
  tableName: 'pre_registrations',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

module.exports = PreRegistration;