'use strict';
const {
  Model,
  Validator
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      //one-to-many (users to spots) - ASSOCIATION 2
      User.hasMany(models.Spot, {
        foreignKey: 'ownerId',
        onDelete: 'CASCADE'
      });
      
      //one-to-many (users to bookings) - ASSOCIATION 1
      User.hasMany(models.Booking, {
        foreignKey: 'userId',
        onDelete: 'CASCADE'
      });

      //one-to-many (users to reviews) - ASSOCIATION 3
      User.hasMany(models.Review, {
        foreignKey: 'userId',
        onDelete: 'CASCADE'
      });
    }
  }
  User.init({
    firstName: {
      type: DataTypes.STRING(30),
      allowNull: false,
      validate: {
        isAlpha: true,
        len: [2, 30]
      }
    },
    lastName: {
      type: DataTypes.STRING(30),
      allowNull: false,
      validate: {
        isAlpha: true,
        len: [2, 30]
      }
    },
    username: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true,
      validate: {
        len: [4, 30],
        isNotEmail(value){
          if(Validator.isEmail(value)) {
            throw new Error ("Cannot be an email.");
          }
        }
      }
    },
    hashedPassword: {
      type: DataTypes.STRING.BINARY,
      allowNull: false,
      validate: {
        len: [60, 60]
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [3, 256],
        isEmail: true
      }
    }
  }, {
    sequelize,
    modelName: 'User',
    //protect hashed password and other personal info/useless info with a default scope
    defaultScope: {
      attributes: {
        exclude: ['hashedPassword', 'email', 'createdAt', 'updatedAt']
      }
    }
  });
  return User;
};