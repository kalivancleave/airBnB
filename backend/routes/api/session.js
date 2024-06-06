const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { User } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

//validate login middleware
const validateLogin = [
  check('credential')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('Email or username is required'),
  check('password')
    .exists({ checkFalsy: true })
    .withMessage('Password is required'),
  handleValidationErrors
];

//get the current user
router.get('/', (req, res) => {
    const { user } = req;
    if (user) {
      const safeUser = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
      };
      return res.json({
        user: safeUser
      });
    } else return res.json({ user: null });
  }
);

//login
router.post('/', validateLogin, async (req, res, next) => {
  try {
    //destructure credential and password from the req.body
    const {credential, password} = req.body;

    //define the unscoped user that is found with that credential
    const user = await User.unscoped().findOne({
      where: {
        [Op.or]: {
          username: credential,
          email: credential
        }
      }
    });

    //invalid credentials
    if(!user || !bcrypt.compareSync(password, user.hashedPassword.toString())){
      res.status(401),
      res.json({
        message: 'Invalid credentials'
      });
    };

    //password and credential matches a user
    //create safe user info for display
    const safeUser = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: user.username,
    }

    await setTokenCookie(res, safeUser);

    return res.json({
      user: safeUser
    });
    
  } catch (error) {
    next(error)
  }
});

//logout
router.delete('/', async(req, res, next) => {
  try {
    res.clearCookie('token');
    return res.json({ message: 'success' });
  } catch (error) {
    next(error)
  }
})


module.exports = router;