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
    url: 'https://res.cloudinary.com/djnfjzocb/image/upload/v1721909733/TudorFarmHouse7_slci3l.png',
    preview: true
  },
  {
    spotId: 1,
    url: 'https://res.cloudinary.com/djnfjzocb/image/upload/v1721909733/TudorFarmHouse9_rzmu7a.png',
    preview: false
  },
  {
    spotId: 1,
    url: 'https://res.cloudinary.com/djnfjzocb/image/upload/v1721909732/TudorFarmHouse8_clh9zq.png',
    preview: false
  },
  {
    spotId: 1,
    url: 'https://res.cloudinary.com/djnfjzocb/image/upload/v1721909729/TudorFarmHouse6_gnzedm.png',
    preview: false
  },
  {
    spotId: 1,
    url: 'https://res.cloudinary.com/djnfjzocb/image/upload/v1721909728/TudorFarmHouse5_nmatta.png',
    preview: false
  },
  {
    spotId: 1,
    url: 'https://res.cloudinary.com/djnfjzocb/image/upload/v1721909726/TudorFarmHouse4_todccw.png',
    preview: false
  },
  {
    spotId: 1,
    url: 'https://res.cloudinary.com/djnfjzocb/image/upload/v1721909725/TudorFarmHouse3_wv2wds.png',
    preview: false
  },
  {
    spotId: 2,
    url: 'https://res.cloudinary.com/djnfjzocb/image/upload/v1721880630/image-placeholder_xsvyni.png',
    preview: true
  },
  {
    spotId: 3,
    url: 'https://res.cloudinary.com/djnfjzocb/image/upload/v1721880630/image-placeholder_xsvyni.png',
    preview: true
  },
  {
    spotId: 4,
    url: 'https://res.cloudinary.com/djnfjzocb/image/upload/v1721880630/image-placeholder_xsvyni.png',
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
