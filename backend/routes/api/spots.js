const express = require('express');

const { requireAuth } = require('../../utils/auth');
const { Spot, SpotImage, Review, User, ReviewImage, Booking } = require('../../db/models');

const {check} = require('express-validator');
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
    .isLength({max: 50})
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
]

//get all spots
router.get('/', async(req, res, next) => {
  try {

    let updatedSpots = [];
    
    //find all spots
    const spots = await Spot.findAll({
    });
    
    //for each spot
    for (let i = 0; i < spots.length; i++){
      const spot = spots[i]
      
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
    //return requested result
    res.json({
      Spots: updatedSpots
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
    const spotId = req.params.spotId

    //find the spot by that id (join spot images table & owner table)
    const spot = await Spot.findByPk(spotId)

    //404 - no spot exists
    if(!spot){
      res.status(404),
      res.json({
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
    let sumOfStars = 0;
    for (let i = 0; i < reviews.length; i++){
      let review = reviews[i]
      let starRating = review.stars
      sumOfStars += starRating
    }
    
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
      numReviews: reviews.length,
      avgStarRating: averageRating,
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
      res.status(404),
      res.json({
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
    } else {
      //Response for NON OWNER
      res.json({
        Bookings: nonOwnerBookings
      });   
    };
    
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
      ownerId: userId,
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price
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
      res.status(404),
      res.json({
        message: "Spot couldn't be found"
      })
    }

    //make sure user owns the spot before posting a photo
    if(spot.ownerId !== userId){
      return res.json({
        //userId: userId, (debugging)
        //spotOwnerId: spot.ownerId, (debugging)
        message: "You must own this spot to post a photo."
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
      id: newImage.id,
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
      res.status(404),
      res.json({
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
      userId: req.user.id,
      spotId: spotId,
      review,
      stars
    });

    //return requested result
    res.status(201)
    res.json(newReview)

  } catch (error) {
    next(error)
  }
})

//edit a spot
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
      res.status(404),
      res.json({
        message: "Spot couldn't be found"
      })
    }

    //check that logged in user owns the spot
    if(spot.ownerId !== userId){
      return res.json({
        //userId: userId, //(debugging)
        //spotOwnerId: spot.ownerId, //(debugging)
        message: "You must own this spot to make edits."
      })
    }

    //spot found && owned by logged in user
    //descturcutre from req.body
    const {address, city, state, country, lat, lng, name, description, price} = req.body;

    //spot.update
    const updatedSpot = await spot.update({
      ownerId: userId,
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price
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
      res.status(404),
      res.json({
        message: "Spot couldn't be found"
      })
    };

    //make sure logged in user is owner of spot
    if(spotToDestroy.ownerId !== userId){
      return res.json({
        //userId: userId, //(debugging)
        //spotOwnerId: spot.ownerId, //(debugging)
        message: "You must own this spot to delete."
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