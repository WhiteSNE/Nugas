'use strict';
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Media extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index.js` file will call this method automatically.
   */
  static associate(models) {
    Media.belongsTo(models.User, {
      foreignKey: 'uploader_id',
    });
  }
}

Media.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  type: {
    type: DataTypes.ENUM('gallery', 'banner'),
    allowNull: false,
    defaultValue: 'gallery',
  },
  status: {
    type: DataTypes.ENUM('permanent', 'temporary'),
    defaultValue: 'permanent',
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  path: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  uploader_id: {
    type: DataTypes.INTEGER,
  },
}, {
  sequelize,
  modelName: 'Media',
  tableName: 'media',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

module.exports = Media;