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
  user_id: {
    type: DataTypes.INTEGER,
  },
}, {
  sequelize,
  modelName: 'Changelog',
  tableName: 'changelogs',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false, // We don't have an `updated_at` column
});

module.exports = Changelog;