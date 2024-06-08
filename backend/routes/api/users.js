const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Booking, Spot, SpotImage } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

//validate sign up info
const validateSignup = [
  check('email')
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage('Invalid email'),
  check('username')
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage('Username is required'),
  check('username')
    .not()
    .isEmail()
    .withMessage('Username cannot be an email.'),
  // check('password')
  //   .exists({ checkFalsy: true })
  //   .isLength({ min: 6 }),
  check('firstName')
    .exists({checkFalsy: true})
    .withMessage('First Name is required'),
  check('lastName')
    .exists({checkFalsy:true})
    .withMessage('Last Name is required'),
  handleValidationErrors
];

//sign up a new user
router.post('/', validateSignup, async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, username } = req.body;
    const hashedPassword = bcrypt.hashSync(password);

    //user already exists
    const userExists = await User.findOne({
      where: {
        email: email,
        username: username
      }
    })

    if(userExists){
      res.status(500),
      res.json({
        message: 'User alerady exists',
        errors: {
          email: 'User with that email already exists',
          username: 'User with that username already exists'
        }
      })
    }

    const user = await User.create({ firstName, lastName, email, username, hashedPassword });

    const safeUser = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: user.username,
    };

    await setTokenCookie(res, safeUser);

    res.status(201),
    res.json({
      user: safeUser
    });
  } catch (error) {
    next(error)
  }
});

//get all user bookings
router.get('/:userId/bookings', requireAuth, async(req, res, next) => {
  try {
    //find user id
    const userId = req.params.userId;

    //find bookings where userId = logged in user id
    const bookings = await Booking.findAll({
      where: {
        userId: userId
      },
      attributes: ['id', 'spotId', 'startDate', 'endDate', 'createdAt', 'updatedAt']
    });

    //404 - no bookings
    if(!bookings){
      res.json({
        message: "No bookings found."
      })
    };
    
    //bookings found && belong to user
    //iterate through the bookings
    let updatedBookings = [];
    for (let i = 0; i < bookings.length; i++){
      let booking = bookings[i];
      
      //add spot info
      const spot = await Spot.findOne({
        attributes: {
          exclude: ['createdAt', 'updatedAt']
        },
        where: {
          id: booking.spotId
        }
      });

      //find image url
      const spotImage = await SpotImage.findOne({
        where: {
          spotId: booking.spotId
        }
      });
      
      const spotPayload = {
        id: spot.id,
        ownerId: spot.ownerId,
        address: spot.address,
        city: spot.city,
        state: spot.state,
        country: spot.country,
        lat: spot.lat,
        lng: spot.lng,
        name: spot.name,
        price: spot.price,
        previewImage: spotImage.url
      }

      const fullBookingInfo = {
        id: booking.id,
        spotId: booking.spotId,
        Spot: spotPayload,
        userId: req.user.id,
        startDate: booking.startDate,
        endDate: booking.endDate,
        createdAt: booking.createdAt,
        updatedAt: booking.updatedAt
      }

      updatedBookings.push(fullBookingInfo);
    }

    //return reuqested response
    res.json({
      Bookings: updatedBookings
    });
    
  } catch (error) {
    next(error)
  }
});



module.exports = router;