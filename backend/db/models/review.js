'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    static associate(models) {
      //one-to-many (users to reviews) - ASSOCIATION 3
      Review.belongsTo(models.User, {
        foreignKey: 'userId'
      });

      //one-to-many (spots to reviews) - ASSOCIATION 6
      Review.belongsTo(models.Spot, {
        foreignKey: 'spotId'
      });

      //one-to-many (reviews to reviewImages) - ASSOCIATION 7
      Review.hasMany(models.ReviewImage, {
        foreignKey: 'reviewId',
        onDelete: 'CASCADE'
      });
    }
  }
  Review.init({
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
    review: {
      type: DataTypes.STRING(350),
      validate: {
        isAlphanumeric: true
      }
    },
    stars: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 5,
      validate: {
        isNumeric: true,
        min: 0, //cannot be less than 0 stars
        max: 5 //cannot be more than 5 stars
      }
    }
  }, {
    sequelize,
    modelName: 'Review',
    defaultScope: {
      attributes: {
        exclude: ['createdAt', 'updatedAt']
      }
    }
  });
  return Review;
};