const express = require('express');

const { requireAuth } = require('../../utils/auth');
const { Spot, SpotImage, Review, User, ReviewImage, Booking } = require('../../db/models');

const {check, matchedData} = require('express-validator');
const {handleValidationErrors} = require('../../utils/validation');

const router = express.Router();

//validate spot info
const validateSpot = [
  check('address')
    .exists({checkFalsy: true})
    .withMessage('Street address is required'),
  check('city')
    .exists({checkFalsy: true})
    .withMessage('City is required'),
  check('state')
    .exists({checkFalsy: true})
    .withMessage('State is required'),
  check('country')
    .exists({checkFalsy: true})
    .withMessage('Country is required'),
  check('lat')
    .isFloat({
      min: -90,
      max: 90
    })
    .withMessage('Latitude must be within -90 and 90'),
  check('lng')
    .isFloat({
      min: -180,
      max: 180
    })
    .withMessage('Longitude must be within -180 and 180'),
  check('name')
    .exists({checkFalsy: true})
    .isString()
    .isLength({
      min: 1,
      max: 49
    })
    .withMessage('Name must be less than 50 characters'),
  check('description')
    .exists({checkFalsy: true})
    .withMessage('Description is required'),
  check('price')
    .isFloat({min: 0})
    .withMessage('Price per day must be a positive number'),
  handleValidationErrors
];

//validate review info
const validateReview = [
  check('review')
    .exists({checkFalsy: true})
    .withMessage('Review text is required'),
  check('stars')
    .isFloat({
      min: 1,
      max: 5
    })
    .withMessage('Stars must be an integer from 1 to 5'),
  handleValidationErrors
];

//validate query info
const validateQuery = [
  check('maxLat')
    .optional()
    .isFloat({
      max: 90
    })
    .withMessage('Maximum latitude is invalid'),
  check('minLat')
    .optional()
    .isFloat({
      min: -90
    })
    .withMessage('Minimum latitude is invalid'),
  check('minLng')
    .optional()
    .isFloat({
      min: -180
    })
    .withMessage('Minimum longitude is invalid'),
  check('maxLng')
    .optional()
    .isFloat({
      max: 180
    })
    .withMessage('Maximum longitude is invalid'),
  check('minPrice')
    .optional()
    .isFloat({
      min: 0
    })
    .withMessage('Minimum price must be greater than or equal to 0'),
  check('maxPrice')
    .optional()
    .isFloat({
      min: 0
    })
    .withMessage('Maximum price must be greater than or equal to 0'),
  handleValidationErrors  
]

//get all spots
router.get('/', validateQuery, async(req, res, next) => {
  try {
    const data = matchedData(req, {includeOptionals: true})
    
    //pagination
    let {page, size} = req.query;

    page = parseInt(page);
    size = parseInt(size);

    //validation errors if page and size are invalid numbers
    //this stops page and size from being forced in the query && 
    //allows for default values to be used if one is omitted
    if(page <= 0){
      res.status(400)
      return res.json({
        message: "Bad Request",
        errors: {
          page: 'Page must be greater than or equal to 1'
        }
      })
    }
    
    if(size <= 0){
      res.status(400)
      return res.json({
        message: "Bad Request",
        errors: {
          size: 'Size must be between 1 and 20'
        }
      })
    } 
    
    if(size && size > 20){
      res.status(400)
      return res.json({
        message: "Bad Request",
        errors: {
          size: 'Size must be between 1 and 20'
        }
      })
    };

    
    if(isNaN(page)) page = 1;
    if(isNaN(size)) size = 20;    

    let updatedSpots = [];
    
    //find all spots
    const spots = await Spot.findAll({
      offset: (page - 1) * size,
      limit: size
    });

    //define all data options - maxPrice minPrice maxLng minLng maxLat minLat
    const minPrice = parseInt(data.minPrice)
    const maxPrice = parseInt(data.maxPrice)
    const minLng = parseInt(data.minLng)
    const maxLng = parseInt(data.maxLng)
    const minLat = parseInt(data.minLat)
    const maxLat = parseInt(data.maxLat)
    
    //filter spots
    let filteredSpots = []
    for (let j = 0; j < spots.length; j++){
      let approvedSpot = spots[j]

      //set all conditions to a true (if one fails a check then turn false)
      let minPriceCheck = true;
      let maxPriceCheck = true;
      let minLngCheck = true;
      let maxLngCheck = true;
      let minLatCheck = true;
      let maxLatCheck = true;

      if(minPrice !== undefined && approvedSpot.price < minPrice){
        minPriceCheck = false
      };

      if(maxPrice !== undefined && approvedSpot.price > maxPrice){
        maxPriceCheck = false
      };
          
      if(minLng !== undefined && approvedSpot.lng < minLng){
        minLngCheck = false
      };
      
      if(maxLng !== undefined && approvedSpot.lng > maxLng){
        maxLngCheck = false
      };
      
      if(minLat !== undefined && approvedSpot.lat < minLat){
        minLatCheck = false
      };
      
      if(maxLat !== undefined && approvedSpot.lat > maxLat){
        maxLatCheck = false
      };
                  
      
      //at the end of all the checks if all conditions are true push to filtered spot
      if(minPriceCheck === true &&
         maxPriceCheck === true &&
         minLngCheck === true &&
         maxLngCheck === true &&
         minLatCheck === true &&
         maxLatCheck === true){
          filteredSpots.push(approvedSpot)
         } 
      
      //reset tests
      minPriceCheck = true;
      maxPriceCheck = true;
      minLngCheck = true;
      maxLngCheck = true;
      minLatCheck = true;
      maxLatCheck = true;
    }

    //iterate through the useable spots
    //for each spot
    for (let i = 0; i < filteredSpots.length; i++){
      const spot = filteredSpots[i]
      
      //find all reviews with that spotId
      const reviews = await Review.findAll({
        where: {
          spotId: spot.id
        }
      });

      //find the sum of all stars
      let sumOfStars = 0;
      for (let i = 0; i < reviews.length; i++){
        let review = reviews[i]
        let starRating = review.stars
        sumOfStars += starRating
      }
      
      //find the average of all the stars from the review table
      const averageRating = sumOfStars/reviews.length

      //find the preview image with that spotId
      const previewImage = await SpotImage.findOne({
        attributes: ['url'],
        where: {
          spotId: spot.id
        }
      });

      const payload = {
      id: parseInt(spot.id),
      ownerId: parseInt(spot.ownerId),
        address: spot.address,
        city: spot.city,
        state: spot.state,
        country: spot.country,
        lat: parseFloat(spot.lat),
        lng: parseFloat(spot.lng),
        name: spot.name,
        description: spot.description,
        price: parseFloat(spot.price),
        createdAt: spot.createdAt,
        updatedAt: spot.updatedAt,
        avgRating: parseFloat(averageRating) || 'No reviews found',
        previewImage: previewImage
      }

      //404 - no image
      if(!previewImage){
        payload.previewImage = "No preview image found"
      } else {
        payload.previewImage = previewImage.url
      }

      updatedSpots.push(payload);
    }

  
    //return requested result
    res.json({
      Spots: updatedSpots,
      page,
      size
    });
    
  } catch (error) {
    next(error)
  }
});

//get all spots owned by the current user
router.get('/current', requireAuth, async (req, res, next) => {
  try {
    //figure out current user id
    const userId = req.user.id
    const user = await User.findByPk(userId);

    //404 - no user
    if(!user){
      res.status(404),
      res.json({
        message: 'No user found'
      })
    };

    //find all spots where owner id is user id
    const spots = await Spot.findAll({
      where: {
        ownerId: userId
      }
    });

    let updatedSpots = []
    //iterate through the spots
    for (let i = 0; i < spots.length; i++) {
      let spot = spots[i]

      //find all reviews with that spotId
      const reviews = await Review.findAll({
        where: {
          spotId: spot.id
        }
      });

      //find the sum of all stars
      let sumOfStars = 0;
      for (let i = 0; i < reviews.length; i++){
        let review = reviews[i]
        let starRating = review.stars
        sumOfStars += starRating
      }
      
      //find the average of all the stars from the review table
      const averageRating = sumOfStars/reviews.length

      //find the preview image with that spotId
      const previewImage = await SpotImage.findOne({
        attributes: ['url'],
        where: {
          spotId: spot.id
        }
      });

      const payload = {
      id: spot.id,
      ownerId: spot.ownerId,
        address: spot.address,
        city: spot.city,
        state: spot.state,
        country: spot.country,
        lat: spot.lat,
        lng: spot.lng,
        name: spot.name,
        description: spot.description,
        price: spot.price,
        createdAt: spot.createdAt,
        updatedAt: spot.updatedAt,
        avgRating: averageRating || 'No reviews found',
        previewImage: previewImage
      }

      //404 - no image
      if(!previewImage){
        payload.previewImage = "No preview image found"
      } else {
        payload.previewImage = previewImage.url
      }

      updatedSpots.push(payload);
    }

    res.json({
      Spots: updatedSpots
    })
    
  } catch (error) {
    next(error)
  }
});

//get details of a spot from the spot ID
router.get('/:spotId', async(req, res, next) => {
  try {
    //find the spot id
    const spotId = parseInt(req.params.spotId)

    //find the spot by that id (join spot images table & owner table)
    const spot = await Spot.findByPk(spotId)

    //404 - no spot exists
    if(!spot){
      res.status(404)
      return res.json({
        message: "Spot couldn't be found"
      })
    }

    //find spotImages with that spotId
    const spotImages = await SpotImage.findAll({
      where: {
        spotId: spotId
      },
      attributes: ['id', 'url', 'preview']
    })

    //find review info with that spotId
    const reviews = await Review.findAll({
      where: {
        spotId: spotId,
      }
    });

    //find the sum of all stars
    let sumOfStars = await Review.sum("stars", {
      where: {
        spotId: spotId
      }
    });
    
    //find the average of all the stars from the review table
    const averageRating = sumOfStars/reviews.length
  

    //find the owner with that spotId
    const owner = await User.findOne({
      where: {
        id: spot.ownerId
      },
      attributes: ['id', 'firstName', 'lastName']
    });

    //spot exists - add requested elements
    const updatedSpot = {
      id: parseInt(spot.id),
      ownerId: parseInt(spot.ownerId),
      address: spot.address,
      city: spot.city,
      state: spot.state,
      country: spot.country,
      lat: parseFloat(spot.lat),
      lng: parseFloat(spot.lng),
      name: spot.name,
      description: spot.description,
      price: parseFloat(spot.price),
      createdAt: spot.createdAt,
      updatedAt: spot.updatedAt,
      numReviews: parseInt(reviews.length),
      avgStarRating: parseFloat(averageRating),
      SpotImages: spotImages,
      Owner: owner
    }

    //return requested result
    res.json(updatedSpot)
    
  } catch (error) {
    next(error)
  }
});

//get all reviews by spotId
router.get('/:spotId/reviews', async(req, res, next) => {
  try {
    //find spot id
    const spotId = req.params.spotId

    //find spot by id
    const spot = await Spot.findByPk(spotId)

    //404 - no spot found
    if(!spot){
      res.status(404)
      return res.json({
        message: "Spot couldn't be found"
      })
    };

    //find reviews by spotId
    const reviews = await Review.findAll({
      where: {
        spotId: spot.id
      }
    })
    
    //iterate through reviews
    let updatedReviews = []
    for(let i = 0; i < reviews.length; i++){
      let review = reviews[i]
      
      //find user
      const user = await User.findOne({
        where: {
          id: review.userId
        },
        attributes: ['id', 'firstName', 'lastName']
      });
      
      //find Review images 
      const images = await ReviewImage.findAll({
        where: {
          reviewId: review.id
        },
        attributes: ['id', 'url']
      })

      const payload = {
        id: review.id,
        userId: review.userId,
        spotId: review.spotId,
        review: review.review,
        stars: review.stars,
        createdAt: review.createdAt,
        updatedAt: review.updatedAt,
        User: user,
        ReviewImages: images
      }
      
      updatedReviews.push(payload);
    };
    
    //return requested response
    res.json({
      Reviews: updatedReviews
    });

  } catch (error) {
    next(error)
  }
});

//get bookings for spot from spot Id
router.get('/:spotId/bookings', requireAuth, async(req, res, next) => {
  try {
    //find spot id
    const spotId = req.params.spotId;
    
    //find spot by id
    const spot = await Spot.findByPk(spotId)
    
    //404 - no spot found
    if(!spot){
      res.status(404)
      return res.json({
        message: "Spot couldn't be found"
      })
    };
    
    //spot found
    //find all bookings based on spotId
    const bookings = await Booking.findAll({
      where: {
        spotId: spotId
      }
    })
    
    //iterate through each booking
    let nonOwnerBookings = [];
    let ownerBookings = [];
    for (let i = 0; i < bookings.length; i++) {
      let booking = bookings[i];   

      if (booking.userId !== req.user.id){

        const nonOwnerBookingInfo = {
          //bookingUserId: booking.userId, //debugging
          //loggedInUserId: req.user.id, //debugging
          spotId: booking.spotId,
          startDate: booking.startDate,
          endDate: booking.endDate
        }
        
        nonOwnerBookings.push(nonOwnerBookingInfo);

      } 
      const user = await User.findOne({
        where: {
          id: booking.userId
        },
        attributes: ['id', 'firstName', 'lastName']
      });

      const ownerBookingInfo = {
        //bookingUserId: booking.userId, //debugging
        //loggedInUserId: req.user.id, //debugging
        User: user,
        id: booking.id,
        spotId: booking.spotId,
        userId: booking.userId,
        startDate: booking.startDate,
        endDate: booking.endDate,
        createdAt: booking.createdAt,
        updatedAt: booking.updatedAt
      }

      ownerBookings.push(ownerBookingInfo);    
    };

    //if user.id is spot.OwnerID
    if(spot.ownerId === req.user.id){
      //Response for OWNER
      res.json({
        Bookings: ownerBookings
      });
    }

    //Response for NON OWNER
    res.json({
      Bookings: nonOwnerBookings
    });   
    
  } catch (error) {
    next(error)
  }
})

//create a spot
router.post('/', requireAuth, validateSpot, async(req, res, next) => {
  try {
    //find the id of the logged in user
    const userId = req.user.id;

    //destructure from body
    const {address, city, state, country, lat, lng, name, description, price} = req.body

    //create a new spot
    const newSpot = await Spot.create({
      ownerId: parseInt(userId),
      address,
      city,
      state,
      country,
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      name,
      description,
      price: parseFloat(price)
    });

    //return requested response
    res.status(201),
    res.json(newSpot)
    
  } catch (error) {
    next(error)
  }
});

//add an image to a spot based on the spot's ID
router.post('/:spotId/images', requireAuth, async(req, res, next) => {
  try {
    //find current logged in user Id
    const userId = req.user.id;

    //find spot id
    const spotId = req.params.spotId;

    
    //find spot by id
    const spot = await Spot.findByPk(spotId);
    
    //404 - no spot
    if(!spot){
      res.status(404)
      return res.json({
        message: "Spot couldn't be found"
      })
    }

    //make sure user owns the spot before posting a photo
    if(spot.ownerId !== userId){
      res.status(403)
      return res.json({
        //userId: userId, (debugging)
        //spotOwnerId: spot.ownerId, (debugging)
        message: "Forbidden"
      })
    }
    
    //spot found
    //destructure req.body
    const {url, preview} = req.body;

    //create new image
    const newImage = await SpotImage.create({
      spotId: spotId,
      url,
      preview
    })

    //return requested response
    res.status(201),
    res.json({
      id: parseInt(newImage.id),
      url: newImage.url,
      preview: newImage.preview
    });
    
  } catch (error) {
    next(error)
  }
});

//create a review for a spot based on the spot's ID
router.post('/:spotId/reviews', requireAuth, validateReview, async(req, res, next) => {
  try {
    //find spot id
    const spotId = req.params.spotId;

    //find spot by ID
    const spot = await Spot.findByPk(spotId);

    //404 - no spot found
    if(!spot){
      res.status(404)
      return res.json({
        message: "Spot couldn't be found"
      })
    }

    //search reviews: if review.id, user.id, and spot.id throw error
    const userReviewsCheck = await Review.findOne({
      where: {
        userId: req.user.id,
        spotId: spotId
      }
    });

    if(userReviewsCheck){
      res.status(500)
      return res.json({
        message: "User already has a review for this spot"
      })
    };
    
    //spot found
    //descructure from req.body
    const {review, stars} = req.body;

    //create a new review
    const newReview = await Review.create({
      userId: parseInt(req.user.id),
      spotId: parseInt(spotId),
      review,
      stars
    });

    //return requested result
    res.status(201)
    res.json(newReview)

  } catch (error) {
    next(error)
  }
});

router.post('/:spotId/bookings', requireAuth, async(req, res, next) => {
  try {
    //find spot id
    const spotId = req.params.spotId;

    //find spot by id
    const spot = await Spot.findByPk(spotId);

    //404 - no spot found
    if(!spot){
      res.status(404)
      return res.json({
        message: "Spot couldn't be found"
      })
    };
    
    //spot found
    //find all bookings for that spot id before adding another booking
    const bookings = await Booking.findAll({
      where: {
        spotId: spotId
      }
    });

    //SPOT MUST NOT BELONG TO CURRENT USER
    if(spot.ownerId !== req.user.id){
      
      //destructure from req.body
      const {startDate, endDate} = req.body;
      
      //check and make sure no booking conflict
      let minAllowedDate = new Date("2018-01-01")
      let newBookingStartDate = new Date(startDate).getTime();
      let newBookingEndDate = new Date(endDate).getTime();

      //400 - bad requests
      if(newBookingEndDate <= newBookingStartDate){
        res.status(400)
        return res.json({
          message: "Bad Request",
          errors: {
            endDate: "endDate cannot be on or before startDate"
          }
        })
      } else if (newBookingStartDate < minAllowedDate){
        res.status(400)
        return res.json({
          message: "Bad Request",
          errors: {
            startDate: "startDate cannot be in the past"
          }
        })
      }
      
      //403 - booking conflict
      //iterate through all bookings
      for (let i = 0; i < bookings.length; i++) {
        let booking = bookings[i];

        //checking requested dates v. all other booked dates
        let date1 = new Date(booking.startDate).getTime();
        let date2 = new Date(booking.endDate).getTime();

        //errors if overlap
        if(newBookingEndDate >= date1 && newBookingEndDate <= date2){
          res.status(403)
          return res.json({
            message: 'Sorry, this spot is already booked for the specified dates',
          errors: {
            endDate: 'End date conflicts with an existing booking'
          }
        })
        } else if(newBookingStartDate >= date1 && newBookingStartDate <= date2){
          res.status(403)
          return res.json({
            message: 'Sorry, this spot is already booked for the specified dates',
            errors: {
              startDate: 'Start date conflicts with an existing booking'
            }
          })
        }; 
      };
    
    //request passes all checks
    //create a booking request
    let newBooking = await Booking.create({
      spotId: spotId,
      userId: req.user.id,
      startDate,
      endDate
    });

    //return requested reponse
    res.status(201)
    res.json(newBooking)
    };

    res.status(403)
    res.json({
      message: 'Forbidden'
    })
    
  } catch (error) {
    next(error)
  }
});

//edit a spot
  //REMOVE VALDATE SPOT AND THE REQ.BODY DOES NOT HAVE TO CONTAIN ALL ITEMS FOR UPDATING
router.put('/:spotId', requireAuth, validateSpot, async(req, res, next) => {
  try {
    //find the spot id
    const spotId = req.params.spotId;

    //find user id
    const userId = req.user.id;

    //find spot by id
    const spot = await Spot.findByPk(spotId);

    //404 - no spot found
    if(!spot){
      res.status(404)
      return res.json({
        message: "Spot couldn't be found"
      })
    }

    //check that logged in user owns the spot
    if(spot.ownerId !== userId){
      res.status(403)
      return res.json({
        //userId: userId, //(debugging)
        //spotOwnerId: spot.ownerId, //(debugging)
        message: "Forbidden"
      })
    }

    //spot found && owned by logged in user
    //descturcutre from req.body
    const {address, city, state, country, lat, lng, name, description, price} = req.body;

    let addressUpdate;
    let cityUpdate;
    let stateUpdate;
    let countryUpdate;
    let latUpdate;
    let lngUpdate;
    let nameUpdate;
    let descriptionUpdate;
    let priceUpdate;

    //items found OR not found in req.body
    if(address){
      addressUpdate = address
    } else {
      addressUpdate = spot.address
    };

    if(city){
      cityUpdate = city
    } else {
      cityUpdate = spot.city
    };

    if(state){
      stateUpdate = state
    } else {
      stateUpdate = spot.state
    };

    if(country){
      countryUpdate = country
    } else {
      countryUpdate = spot.country
    };

    if(lat){
      latUpdate = lat
    } else {
      latUpdate = spot.lat
    };

    if(lng){
      lngUpdate = lng
    } else {
      lngUpdate = spot.lng
    };

    if(name){
      nameUpdate = name
    } else {
      nameUpdate = spot.name
    };

    if(description){
      descriptionUpdate = description
    } else {
      descriptionUpdate = spot.description
    };

    if(price){
      priceUpdate = price
    } else {
      priceUpdate = spot.price
    };

    //validation errors
    if(addressUpdate === undefined){
      res.status(400)
      return res.json({
        message: "Bad Request",
        errors: {
          address: "Street address is required"
        }
      })
    };

    if(cityUpdate === undefined){
      res.status(400)
      return res.json({
        message: "Bad Request",
        errors: {
          city: "City is required"
        }
      })
    };

    if(stateUpdate === undefined){
      res.status(400)
      return res.json({
        message: "Bad Request",
        errors: {
          state: "State is required"
        }
      })
    };

    if(countryUpdate === undefined){
      res.status(400)
      return res.json({
        message: "Bad Request",
        errors: {
          country: "Country is required"
        }
      })
    };

    if(latUpdate !== undefined && lat < -90 || latUpdate !== undefined && lat > 90){
      res.status(400)
      return res.json({
        message: "Bad Request",
        errors: {
          lat: "Latitude must be within -90 and 90"
        }
      })
    };

    if(lngUpdate !== undefined && lng < -180 || lngUpdate !== undefined && lng > 180){
      res.status(400)
      return res.json({
        message: "Bad Request",
        errors: {
          lng: "Longitude must be within -180 and 180"
        }
      })
    };
    

    if(nameUpdate !== undefined && nameUpdate.split("").length >= 50){
      res.status(400)
      return res.json({
        message: "Bad Request",
        errors: {
          name: "Name must be less than 50 characters"
        }
      })
    };

    if(descriptionUpdate === undefined){
      res.status(400)
      return res.json({
        message: "Bad Request",
        errors: {
          description: "Description is required"
        }
      })
    };

    if(priceUpdate !== undefined && price < 0){
      res.status(400)
      return res.json({
        message: "Bad Request",
        errors: {
          price: "Price per day must be a positive number"
        }
      })
    };

    //spot.update
    const updatedSpot = await spot.update({
      ownerId: parseInt(userId),
      address: addressUpdate,
      city: cityUpdate,
      state: stateUpdate,
      country: countryUpdate,
      lat: parseFloat(latUpdate),
      lng: parseFloat(lngUpdate),
      name: nameUpdate,
      description: descriptionUpdate,
      price: parseFloat(priceUpdate)
    });

    //return requested result
    res.json(updatedSpot)
    
  } catch (error) {
    next(error)
  }
});

//delete a spot
router.delete('/:spotId', requireAuth, async(req, res, next) => {
  try {
    //find spot id
    const spotId = req.params.spotId;

    //find spot by id
    const spotToDestroy = await Spot.findByPk(spotId);

    //find logged in user id
    const userId = req.user.id;

    //404 - no spot found
    if(!spotToDestroy){
      res.status(404)
      return res.json({
        message: "Spot couldn't be found"
      })
    };

    //make sure logged in user is owner of spot
    if(spotToDestroy.ownerId !== userId){
      res.status(403)
      return res.json({
        //userId: userId, //(debugging)
        //spotOwnerId: spot.ownerId, //(debugging)
        message: "Forbidden"
      })
    };

    //spot found && user is owner
    //destroy spot
    await spotToDestroy.destroy();

    //return requested result
    res.json({
      message: "Successfully deleted"
    });
    
  } catch (error) {
    next(error)
  }
})

module.exports = router;