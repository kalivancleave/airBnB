const express = require('express');

const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { Spot, SpotImage, Review } = require('../../db/models');

const router = express.Router();

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
})

module.exports = router;