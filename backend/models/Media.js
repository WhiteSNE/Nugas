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
    // define association here
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
  updatedAt: false, // We don't have an `updated_at` column
});

module.exports = Media;