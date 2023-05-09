'use strict';

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductCart extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {  
    }
  }
  ProductCart.init({
    // productIMAGES: DataTypes.STRING,
    // productTitle: DataTypes.STRING,
    // productPrice: DataTypes.STRING,
    // productQuantity: DataTypes.STRING,
    // productAction: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'ProductCart',
  });
  return ProductCart;
};