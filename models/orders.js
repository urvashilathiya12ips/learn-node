'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Order extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Order.hasMany(models.Order_detail, {
                foreignKey: 'order_id',
                allowNull: false,
                onDelete: 'CASCADE'
            });

            //Foreign key 
            Order.belongsTo(models.User, {
                foreignKey: 'user_id',
                onDelete: 'CASCADE',
            })
        }
    }
    Order.init({

    }, {
        sequelize,
        modelName: 'Order',
    });
    return Order;
};