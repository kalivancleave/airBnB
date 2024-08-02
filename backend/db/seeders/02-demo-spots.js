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
    name: 'The Epic Tudor Farmhouse',
    description: 'Sometimes, sentimentality gets the better of us. For a husband and wife in Cherry Hills Village, the decision to remodel instead of scrape came down to sheer emotion. Since 2006, the couple had worked on multiple plans to demolish their house and rebuild, but a decade into the process they pivoted toward renovation instead.',
    price: 150.00
  },
  {
    ownerId: 2,
    address: '222 NE 2nd St',
    city: 'Second City',
    state: 'Second',
    country: 'USA',
    lat: 85.25478,
    lng: -100.463587,
    name: 'Gingerbread House',
    description: 'Gingerbread house creating, decorating sugar cookies, pumpkin pie, etc., are all yummy treats we enjoy.',
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
    name: 'Treehouse',
    description: "Treehouse is a truly unique place. Part of it's uniqueness has to do with that it is a home grown and based business.",
    price: 269.00
  },
  {
    ownerId: 4,
    address: '123 Somewhere Lane',
    city: 'San Francisco',
    state: 'California',
    country: 'United States of America',
    lat: 37.7645358,
    lng: -122.4730327,
    name: 'Tiny Log Cabin',
    description: 'THE original cabin in the woods. Free of ghosts and murderers.',
    price: 10.00
  },
  {
    ownerId: 1,
    address: '888 Cozy Casa St',
    city: 'Dreamland',
    state: 'Wyoming',
    country: 'United States of America',
    lat: 77.7645358,
    lng: -100.4730327,
    name: 'Coziest of Casas',
    description: 'So adorable and sweet it will make even the grumpiest of humans happy.',
    price: 78.50
  }
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
