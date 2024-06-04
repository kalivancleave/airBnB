'use strict';

const {SpotImage} = require('../models');
const bcrypt = require('bcryptjs');
const {Op} = require('sequelize');

//define schema
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA //define your schema in optons object
}

const spotImages = [
  {
    spotId: 1,
    url: 'imageurl1.com'
  },
  {
    spotId: 1,
    url: 'imageurl2.com'
  },
  {
    spotId: 1,
    url: 'imageurl3.com'
  },
  {
    spotId: 2,
    url: 'imageurl4.com'
  }
]

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'SpotImages'; //options definition for using schema
    options.validate = true;
    await SpotImage.bulkCreate(spotImages, options);
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'SpotImages'; //options definition for using schema
    return queryInterface.bulkDelete(options, {
      id: {
        [Op.in]: [1, 2, 3, 4]
      }
    }, {});
  }
};
