const { sequelize } = require('../config/db');
const User = require('./userModel');
const Product = require('./productModel');

// Define associations if needed
User.hasMany(Product, { foreignKey: 'userId', as: 'products' });
Product.belongsTo(User, { foreignKey: 'userId', as: 'vendor' });

module.exports = {
  sequelize,
  User,
  Product,
};
