'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    static associate(models) {
      // define association here
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
        isAlphanumeric: true,
        len: [5, 256]
      }
    },
    city: {
      type: DataTypes.STRING(30),
      allowNull: false,
      validate: {
        len: [3, 30],
        isAlpha: true
      }
    },
    state: {
      type: DataTypes.STRING(30),
      allowNull: false,
      validate: {
        len: [2, 30],
        isAlpha: true
      }
    },
    country: {
      type: DataTypes.STRING(30),
      allowNull: false,
      validate: {
        isAlpha: true,
        len: [3, 30]
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
        isAlphanumeric: true,
        len: [2, 50]
      }
    },
    description: {
      type: DataTypes.STRING(350),
      allowNull: false,
      validate: {
        len: [10, 350],
        isAlphanumeric: true
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