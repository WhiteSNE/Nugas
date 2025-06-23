const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');

class User extends Model {
  // Instance method to check password
  async isValidPassword(password) {
    return await bcrypt.compare(password, this.password);
  }
  static associate(models){
    User.hasMany(models.Media, {
        foreignKey: 'uploader_id', // <-- DIUBAH menjadi 'u' kecil
    });
    User.hasMany(models.Changelog, {
        foreignKey: 'user_id',
    });
  }
}

User.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
  name: { type: DataTypes.STRING, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM('admin', 'client'), defaultValue: 'client' },
  status: { type: DataTypes.ENUM('pending_verification', 'active', 'suspended'), defaultValue: 'pending_verification' },
  verification_token: DataTypes.STRING,
  token_expires_at: DataTypes.DATE,
  verified_at: DataTypes.DATE
}, {
  sequelize,
  modelName: 'User',
  tableName: 'users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false, // We don't have an `updated_at` column in the migration
  hooks: {
    // Hash password before creating a user
    beforeCreate: async (user) => {
      if (user.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  }
});

module.exports = User;