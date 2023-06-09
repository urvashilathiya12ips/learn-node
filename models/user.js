"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      console.log(models);
      User.belongsToMany(models.Products, {
        through: models.ProductCart,
      });
      User.hasMany(models.Order, {
        foreignKey: 'user_id',
        onDelete: 'CASCADE'
      });
    }
  }
  User.init(
    {
      role: DataTypes.STRING,
      firstName: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      forgot_token: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
