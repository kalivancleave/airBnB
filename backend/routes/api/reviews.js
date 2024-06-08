const express = require('express');

const { requireAuth } = require('../../utils/auth');
const { Spot, SpotImage, Review, User, ReviewImage } = require('../../db/models');

const {check} = require('express-validator');
const {handleValidationErrors} = require('../../utils/validation');

const router = express.Router();

//get all reviews of current user
router.get('/current', requireAuth, async(req, res, next) => {
  try {
    //find the current user id
    const userId = req.user.id;

    //get all reviews where user.id === reviews.userId
    const reviews = await Review.findAll({
      where: {
        userId: userId
      }
    });

    //404 - no reviews found
    if(reviews.length === 0) {
      res.status(404),
      res.json({
        message: 'No reviews found.'
      })
    }
    
    //for each review iterate through each review && add spot && add review Images
    let updatedReviews = [];
    for(let i = 0; i < reviews.length; i++) {
      let review = reviews[i];

      //find user
      const user = await User.findOne({
        where: {
          id: userId
        },
        attributes: ['id', 'firstName', 'lastName']
      });

      //find spot
      const spot = await Spot.findOne({
        attributes: {
          exclude: ['createdAt', 'updatedAt']
        },
        where: {
          id: review.spotId
        },
      });

      //find image url
      const previewImage = await SpotImage.findOne({
        where: {
          spotId: spot.id
        },
        attributes: ['url']
      });


      //add previewImage to spot
      let updatedSpot = {
        id: spot.id,
        ownerId: spot.id,
        address: spot.address,
        city: spot.city,
        state: spot.state,
        country: spot.country,
        lat: spot.lat,
        lng: spot.lng,
        name: spot.name,
        price: spot.price,
        previewImage: previewImage.url
      }

      //add review images
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
        Spot: updatedSpot,
        ReviewImages: images
      }

      //add updated reviews to array
      updatedReviews.push(payload)
    };

    //return requested result
    res.json({
      Reviews: updatedReviews
    });
    
  } catch (error) {
    next(error)
  }
});





module.exports = router;