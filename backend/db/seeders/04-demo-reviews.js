'use strict';

const {Review} = require('../models');
const bcrypt = require('bcryptjs');
const {Op} = require('sequelize');

//define schema
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA //define your schema in optons object
}

const reviews = [
  {
    spotId: 1,
    userId: 2,
    review: "Some words about a space.",
    stars: 5
  },
  {
    spotId: 1,
    userId: 1,
    review: "Some MORE words about a space.",
    stars: 4
  },
  {
    spotId: 2,
    userId: 2,
    stars: 5
  },
]

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Reviews'; //options definition for using schema
    options.validate = true;
    await Review.bulkCreate(reviews, options);
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Reviews'; //options definition for using schema
    return queryInterface.bulkDelete(options, {
      id: {
        [Op.in]: [1, 2, 3]
      }
    }, {});
  }
};
