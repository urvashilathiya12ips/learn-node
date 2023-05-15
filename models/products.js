"use strict";

const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Products extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Products.belongsToMany(models.User, {
        through: models.ProductCart,
      });
    }
  }
  Products.init(
    {
      productName: DataTypes.STRING,
      productPrice: DataTypes.INTEGER,
      productDiscription: DataTypes.TEXT,
      productImage: DataTypes.STRING,
      productLabel: DataTypes.STRING,
      productSize: DataTypes.STRING,
      productOffer: DataTypes.STRING,
      productPath: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Products",
    }
  );
  return Products;
};
