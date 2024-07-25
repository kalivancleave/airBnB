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
    url: 'TudorFarmHouseMain_yk6i6e.png',
    preview: true
  },
  {
    spotId: 2,
    url: 'image-placeholder_xsvyni.png',
    preview: true
  },
  {
    spotId: 1,
    url: 'image-placeholder_xsvyni.png',
    preview: false
  },
  {
    spotId: 3,
    url: 'image-placeholder_xsvyni.png',
    preview: true
  },
  {
    spotId: 4,
    url: 'image-placeholder_xsvyni.png',
    preview: false
  },
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
