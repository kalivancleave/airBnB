'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    static associate(models) {
      //one-to-many (users to spots) - ASSOCIATION 2
      Spot.belongsTo(models.User, {
        foreignKey: 'ownerId'
      });

      //one-to-many (spots to bookings) - ASSOCIATION 4
      Spot.hasMany(models.Booking, {
        foreignKey: 'spotId',
        onDelete: 'CASCADE'
      });

      //one-to-many (spots to spotImages) - ASSOCIATION 5
      Spot.hasMany(models.SpotImage, {
        foreignKey: 'spotId',
        onDelete: 'CASCADE'
      });

      //one-to-many (spots to reviews) - ASSOCIATION 6
      Spot.hasMany(models.Review, {
        foreignKey: 'spotId',
        onDelete: 'CASCADE'
      });
    }
  }
  Spot.init({
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isNumeric: true
      }
    },
    address: {
      type: DataTypes.STRING(256),
      allowNull: false,
      validate: {
        len: [2, 256]
      }
    },
    city: {
      type: DataTypes.STRING(30),
      allowNull: false,
      validate: {
        len: [3, 30]
      }
    },
    state: {
      type: DataTypes.STRING(30),
      allowNull: false,
      validate: {
        len: [2, 30]
      }
    },
    country: {
      type: DataTypes.STRING(30),
      allowNull: false,
      validate: {
        len: [2, 30]
      }
    },
    lat: {
      type: DataTypes.DECIMAL,
      validate: {
        isDecimal: true
      }
    },
    lng: {
      type: DataTypes.DECIMAL,
      validate: {
        isDecimal: true
      }
    },
    name: {
      type: DataTypes.STRING(50),
      unique: true,
      allowNull: false,
      validate: {
        len: [2, 50]
      }
    },
    description: {
      type: DataTypes.STRING(350),
      allowNull: false,
      validate: {
        len: [10, 350]
      }
    },
    price: {
      type: DataTypes.DECIMAL,
      defaultValue: 0.00,
      allowNull: false,
      validate: {
        //cannot be a negative price
        min: 0,
        isDecimal: true
      }
    }
  }, {
    sequelize,
    modelName: 'Spot',
    defaultScope: {
      attributes: {
        exclude: ['createdAt', 'updatedAt']
      }
    }
  });
  return Spot;
};