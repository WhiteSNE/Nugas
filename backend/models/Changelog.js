'use strict';
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Changelog extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index.js` file will call this method automatically.
   */
  static associate(models) {
    // define association here
    Changelog.belongsTo(models.User, {
      foreignKey: 'user_id',
    });
  }
}

Changelog.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  category: {
    type: DataTypes.ENUM('bugfix', 'update', 'maintenance', 'announcement'),
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  bannerImageUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
  },
}, {
  sequelize,
  modelName: 'Changelog',
  tableName: 'changelogs',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

module.exports = Changelog;