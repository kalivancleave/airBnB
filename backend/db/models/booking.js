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
      type: DataTypes.DATE,
      validate: {
        isAfter: '2024-01-01'
      }
    },
    endDate: {
      type: DataTypes.DATE,
      validate: {
        //cannot end before the date it starts
        dateCheck(value) {
          //this may be wrong. There was a homework on checking/comparing dates.
          //this is just brainstorming to get thoughts onto paper
          if (this.startDate > value){
            throw new Error("End date must occur after start date.")
          }
        }
      }
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