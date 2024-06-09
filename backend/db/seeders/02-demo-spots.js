'use strict';

const {Spot} = require('../models');
const bcrypt = require('bcryptjs');
const {Op} = require('sequelize');

//define schema
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA //define your schema in optons object
}

const spots = [
  {
    ownerId: 1,
    address: '1111 NE 1st St',
    city: 'First City',
    state: 'First',
    country: 'USA',
    lat: 45.25478,
    lng: -122.463587,
    name: 'The First Spot',
    description: 'A wonderful place to stay.',
    price: 50.00
  },
  {
    ownerId: 1,
    address: '222 NE 2nd St',
    city: 'Second City',
    state: 'Second',
    country: 'USA',
    lat: 85.25478,
    lng: -100.463587,
    name: 'The Second Spot',
    description: 'Another wonderful place to stay.',
    price: 70.00
  },
  {
    ownerId: 3,
    address: '3333 NE 3rd St',
    city: 'Third City',
    state: 'Third',
    country: 'USA',
    lat: -23.25478,
    lng: 56.463587,
    name: 'The Third Spot',
    description: 'A third option for a wonderful place to stay.',
    price: 2.00
  },
  {
    ownerId: 4,
    address: '123 Disney Lane',
    city: 'San Francisco',
    state: 'California',
    country: 'United States of America',
    lat: 37.7645358,
    lng: -122.4730327,
    name: 'App Academy',
    description: 'Place where web developers are created.',
    price: 123.00
  },
]

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Spots'; //options definition for using schema
    options.validate = true;
    await Spot.bulkCreate(spots, options);
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Spots'; //options definition for using schema
    return queryInterface.bulkDelete(options, {
      id: {
        [Op.in]: [1, 2, 3]
      }
    }, {});
  }
};
