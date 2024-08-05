'use strict';

const {User} = require('../models');
const bcrypt = require('bcryptjs');
const {Op} = require('sequelize');

//define schema
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA //define your schema in optons object
}

const users = [
  {
    firstName: 'Alpha',
    lastName: 'Abraham',
    username: 'alphaabraham',
    hashedPassword: bcrypt.hashSync('alphaspassword'),
    email: 'alphaA@test.io',
  },
  {
    firstName: 'Bravo',
    lastName: 'Benjamin',
    username: 'bravobenjamin',
    hashedPassword: bcrypt.hashSync('bravospassword'),
    email: 'bravoB@test.io',
  },
  {
    firstName: 'Charlie',
    lastName: 'Cooper',
    username: 'charliecooper',
    hashedPassword: bcrypt.hashSync('charliespassword'),
    email: 'charlieC@test.io',
  },
  {
    firstName: 'John',
    lastName: 'Smith',
    username: 'JohnSmith',
    hashedPassword: bcrypt.hashSync('secret password'),
    email: 'john.smith@gmail.com'
  },
  {
    firstName: 'Erin',
    lastName: 'Carter',
    username: 'ErinCarter',
    hashedPassword: bcrypt.hashSync('erinpassword'),
    email: 'erin.carter@gmail.com'
  },
  {
    firstName: 'Mark',
    lastName: 'Jones',
    username: 'MarkJones',
    hashedPassword: bcrypt.hashSync('markpassword'),
    email: 'mark.jones@gmail.com'
  },
  {
    firstName: 'Herbert',
    lastName: 'Howard',
    username: 'HerbertHoward',
    hashedPassword: bcrypt.hashSync('herbertpassword'),
    email: 'herbert.howard@gmail.com'
  }
]

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Users', //options definition for using schema
    options.validate = true,
    await User.bulkCreate(users, options);
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Users'; //options definition for using schema
    return queryInterface.bulkDelete(options, {
      username: {
        [Op.in]: ['alphaabraham', 'bravobenjamin', 'charliecooper']
      }
    }, {});
  }
};
