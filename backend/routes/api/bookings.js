const express = require('express');

const { requireAuth } = require('../../utils/auth');
const { Spot, SpotImage, Review, User, ReviewImage, Booking } = require('../../db/models');

const {check} = require('express-validator');
const {handleValidationErrors} = require('../../utils/validation');

const router = express.Router();

//get all user bookings
router.get('/current', requireAuth, async(req, res, next) => {
  try {
    //find user id
    const userId = req.user.id;

    //find bookings where userId = logged in user id
    const bookings = await Booking.findAll({
      where: {
        userId: userId
      },
      attributes: ['id', 'spotId', 'startDate', 'endDate', 'createdAt', 'updatedAt']
    });

    //404 - no bookings
    // if(!bookings){
    //   res.json({
    //     message: "No bookings found."
    //   })
    // };
    
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