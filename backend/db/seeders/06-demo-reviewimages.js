'use strict';

const {ReviewImage} = require('../models');
const bcrypt = require('bcryptjs');
const {Op} = require('sequelize');

//define schema
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA //define your schema in optons object
}

const reviewImages = [
  {
    reviewId: 1,
    url: 'reviewurl1.com'
  },
  {
    reviewId: 2,
    url: 'reviewurl2.com'
  },
  {
    reviewId: 3,
    url: 'reviewurl3.com'
  },
]

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'ReviewImages'; //options definition for using schema
    options.validate = true;
    await ReviewImage.bulkCreate(reviewImages, options);
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'ReviewImages'; //options definition for using schema
    return queryInterface.bulkDelete(options, {
      id: {
        [Op.in]: [1, 2, 3]
      }
    }, {});
  }
};
