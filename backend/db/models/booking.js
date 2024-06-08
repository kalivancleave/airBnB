'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    static associate(models) {
      //one-to-many (users to bookings) - ASSOCIATION 1
      Booking.belongsTo(models.User, {
        foreignKey: 'userId'
      });

      //one-to-many (spots to bookings) - ASSOCIATION 4
      Booking.belongsTo(models.Spot, {
        foreignKey: 'spotId'
      });
    }
  }
  Booking.init({
    spotId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isNumeric: true
      }
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isNumeric: true
      }
    },
    startDate: {
      type: DataTypes.DATE
    },
    endDate: {
      type: DataTypes.DATE
    }
  }, {
    sequelize,
    modelName: 'Booking',
    defaultScope: {
      attributes: {
        //default scope code here
      }
    }
  });
  return Booking;
};