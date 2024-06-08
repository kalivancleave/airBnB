'use strict';

const {Booking} = require('../models');
const bcrypt = require('bcryptjs');
const {Op} = require('sequelize');

//define schema
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA //define your schema in optons object
}

const bookings = [
  {
    spotId: 1,
    userId: 1,
    startDate: '2024-01-02',
    endDate: '2024-02-02'
  },
  {
    spotId: 2,
    userId: 3,
    startDate: '2024-02-01',
    endDate: '2024-03-02'
  },
  {
    spotId: 1,
    userId: 2,
    startDate: '2024-03-02',
    endDate: '2024-04-01'
  },
  {
    spotId: 3,
    userId: 2,
    startDate: '2024-03-02',
    endDate: '2024-04-01'
  },
]

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Bookings'; //options definition for using schema
    options.validate = true;
    await Booking.bulkCreate(bookings, options);
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Bookings'; //options definition for using schema
    return queryInterface.bulkDelete(options, {
      spotId: {
        [Op.in]: [1, 2, 3]
      }
    }, {});
  }
};
