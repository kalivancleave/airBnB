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

      let updatedSpotImage = "No spot images found"
      if(spotImage){
        updatedSpotImage = spotImage.url
      };
      
      const spotPayload = {
        id: spot.id,
        ownerId: spot.ownerId,
        address: spot.address,
        city: spot.city,
        state: spot.state,
        country: spot.country,
        lat: parseFloat(spot.lat),
        lng: parseFloat(spot.lng),
        name: spot.name,
        price: parseFloat(spot.price),
        previewImage: updatedSpotImage
      }

      const fullBookingInfo = {
        id: booking.id,
        spotId: booking.spotId,
        Spot: spotPayload,
        userId: req.user.id,
        startDate: booking.startDate.toISOString().split('T')[0],
        endDate: booking.endDate.toISOString().split('T')[0],
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

//edit a booking
router.put('/:bookingId', requireAuth, async(req, res, next) => {
  try {
    //find booking id
    const bookingId = req.params.bookingId;

    //find booking by id
    const booking = await Booking.findByPk(bookingId)

    //404 - no booking found
    if(!booking){
      res.status(404)
      return res.json({
        message: "Booking couldn't be found"
      })
    };

    //make sure that the logged in user ownes the booking
    if(booking.userId !== req.user.id){
      res.status(403)
      return res.json({
        message: "Forbidden"
      });
    }

    //booking found - descructure from req.body
    const {startDate, endDate} = req.body
    let startDateUpdate;
    let endDateUpdate;

    //important dates
    const minAllowedDate = new Date("2018-01-01");
    const newBookingStartDate = new Date(startDate).getTime();
    const newBookingEndDate = new Date(endDate).getTime();
    const today = new Date().getTime();

      //if start date is OR is not entered in req.body
      if(startDate){
        startDateUpdate = startDate
      } else {
        startDateUpdate = booking.startDate
      };

      //if end date is OR is not entered in req.body
      if(endDate){
        endDateUpdate = endDate
      } else {
        endDateUpdate = booking.endDate
      };
  
      //400 - bad requests
      if(newBookingEndDate <= newBookingStartDate){
        res.status(400)
        res.json({
          message: "Bad Request",
          errors: {
            endDate: "endDate cannot be on or before startDate"
          }
        })
      } else if (newBookingStartDate < minAllowedDate){
        res.status(400)
        res.json({
          message: "Bad Request",
          errors: {
            startDate: "startDate cannot be in the past"
          }
        })
      };

    //set current booking dates to a date that will never conflict
    await booking.update({
      startDate: '2000-01-01',
      endDate: '2000-01-02'
    });

    //find all the bookings for the spot id (this should exclude the current deleted booking)
    const spot = await Spot.findByPk(booking.spotId)

    const bookings = await Booking.findAll({
      where: {
        spotId: spot.id
      }
    });

    //iterate through existing bookings and make sure no conflicts
    for (let i = 0; i < bookings.length; i++){
      let booking = bookings[i];

        //403 - checking requested dates v. all other booked dates
        let date1 = new Date(booking.startDate).getTime();
        let date2 = new Date(booking.endDate).getTime();
    
        //errors if overlap
        if(newBookingEndDate >= date1 && newBookingEndDate <= date2){
          res.status(403)
          return res.json({
            message: 'Sorry, this spot is already booked for the specified dates',
            errors: {
              startDate: 'Start date conflicts with an existing booking',
              endDate: 'End date conflicts with an existing booking'
            }
          })
        } else if(newBookingStartDate >= date1 && newBookingStartDate <= date2){
          res.status(403)
          return res.json({
            message: 'Sorry, this spot is already booked for the specified dates',
            errors: {
              startDate: 'Start date conflicts with an existing booking',
              endDate: 'End date conflicts with an existing booking'
            }
          })
        } else if(newBookingStartDate <= date1 && newBookingEndDate >= date2){
          res.status(403)
          return res.json({
            message: 'Sorry, this spot is already booked for the specified dates',
            errors: {
              startDate: 'Start date conflicts with an existing booking',
              endDate: 'End date conflicts with an existing booking'
            }
          })
        } else if(newBookingEndDate <= today){
          res.status(403)
          return res.json({
            message: "Past bookings can't be modified"
          })
        }; 
      }

    //passes all restrictions - booking.update
    let updatedBooking = await booking.update({
      id: booking.id,
      spotId: booking.spotId,
      userId: booking.userId,
      startDate: startDateUpdate.toISOString().split('T')[0],
      endDate: endDateUpdate.toISOString().split('T')[0]
    });
  
    //return requested response
    res.json(updatedBooking);

  } catch (error) {
    next(error)
  }
});

//delete a booking
router.delete('/:bookingId', requireAuth, async(req, res, next) => {
  try {
    //find booking id
    const bookingId = req.params.bookingId;

    //find booking by id
    const booking = await Booking.findByPk(bookingId);

    //404 - no booking found
    if(!booking){
      res.status(404)
      return res.json({
        message: "Booking couldn't be found"
      })
    };

    //authorization - booking must belong to current user OR booked spot belongs to current user
    const spot = await Spot.findOne({
      where: {
        id: booking.spotId
      }
    });

    if(booking.userId !== req.user.id && spot.ownerId !== req.user.id){
      res.status(403)
      return res.json({
        message: "Forbidden"
      })
    };

    //403 - booking already started
    const today = new Date().getTime();
    const startDate = new Date(booking.startDate).getTime();

    if(startDate <= today){
      res.status(403)
      return res.json({
        message: "Bookings that have started can't be deleted"
      })
    };

    //booking passes all restrictions - destroy
    const destroyedBooking = await booking.destroy();

    //return requested response
    res.json({
      message: "Successfully deleted"
    });
    
  } catch (error) {
    next(error)
  }
})



module.exports = router;