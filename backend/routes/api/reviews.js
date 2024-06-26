const express = require('express');

const { requireAuth } = require('../../utils/auth');
const { Spot, SpotImage, Review, User, ReviewImage } = require('../../db/models');

const {check} = require('express-validator');
const {handleValidationErrors} = require('../../utils/validation');

const router = express.Router();

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
    // if(reviews.length === 0) {
    //   res.status(404),
    //   res.json({
    //     message: 'No reviews found.'
    //   })
    // }
    
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
        }
      });

      let updatedSpotPreviewImage = "No preview image found"

      if(previewImage){
        updatedSpotPreviewImage = previewImage.url
      }


      //add previewImage to spot
      let updatedSpot = {
        id: spot.id,
        ownerId: spot.id,
        address: spot.address,
        city: spot.city,
        state: spot.state,
        country: spot.country,
        lat: parseFloat(spot.lat),
        lng: parseFloat(spot.lng),
        name: spot.name,
        price: parseFloat(spot.price),
        previewImage: updatedSpotPreviewImage
      }

      //add review images
      const images = await ReviewImage.findAll({
        where: {
          reviewId: review.id
        },
        attributes: ['id', 'url']
      });

      let updatedSpotReviewImages = images

      if(!images){
        updatedSpotReviewImages = "No review images found"
      }
      
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
        ReviewImages: updatedSpotReviewImages
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

router.post('/:reviewId/images', requireAuth, async(req, res, next) => {
  try {
    //find review id
    const reviewId = req.params.reviewId; //reviewImage

    //find review by id
    const review = await Review.findByPk(reviewId);

    //404 - no review found
    if(!review){
      res.status(404)
      return res.json({
        message: "Review couldn't be found"
      })
    };

    //check if user id matches review id owner
    if(review.userId !== req.user.id){
      res.status(403)
      return res.json({
        message: 'Forbidden'
      })
    }

    //check review image.length (over 10 images throw error)
    const reviewImages = await ReviewImage.findAll({
      where: {
        reviewId: review.id
      }
    });

    if(reviewImages.length >= 10){
      res.status(403)
      return res.json({
        message: "Maximum number of images for this resource was reached"
      })
    };

    //all of the checks pass
    //destructure from req.body
    const {url} = req.body;

    //create new review image
    const newImage = await ReviewImage.create({
      reviewId: reviewId,
      url
    });

    let newImageURL = newImage.url;
    let newImageId = newImage.id;

    //return requested response
    res.status(201)
    res.json({
      id: newImageId,
      url: newImageURL
    });
    
  } catch (error) {
    next(error)
  }
});

//edit a review
router.put('/:reviewId', requireAuth, validateReview, async(req, res, next) => {
  try {
    //find review id
    const reviewId = req.params.reviewId;

    //find review by id
    const reviewToUpdate = await Review.findByPk(reviewId);

    //404 - no review found
    if(!reviewToUpdate){
      res.status(404)
      return res.json({
        message: "Review couldn't be found"
      })
    };

    //review found
    //check user owns review
    if(reviewToUpdate.userId !== req.user.id){
      res.status(403)
      return res.json({
        message: 'Forbidden'
      })
    }

    //passes all tests - descructure from req.body
    const {review, stars} = req.body;

    let reviewResult;
    let starsResult;

    //if items exist in req.body OR not
    if(review){
      reviewResult = review
    } else {
      reviewResult = reviewToUpdate.review
    };

    if(stars){
      starsResult = stars
    } else {
      starsResult = reviewToUpdate.stars
    };

    //validation errors
    if(reviewResult === undefined){
      res.status(400)
      return res.json({
        message: "Bad Request",
        errors: {
          review: "Review text is required"
        }
      })
    };

    if(typeof(starsResult) !== "number" || starsResult < 1 || starsResult > 5){
      res.status(400)
      return res.json({
        message: "Bad Request",
        errors: {
          stars: "Stars must be an integer from 1 to 5"
        }
      })
    }

    //review.update
    let updatedReview = await reviewToUpdate.update({
      userId: req.user.id,
      spotId: reviewToUpdate.SpotId,
      review: reviewResult,
      stars: starsResult
    });

    //return requested response
    res.json(updatedReview);
    
  } catch (error) {
    next(error)
  }
});

router.delete('/:reviewId', requireAuth, async(req, res, next) => {
  try {
    //find review id
    const reviewId = req.params.reviewId;

    //find review by id
    const review = await Review.findByPk(reviewId);

    //404 - no review found
    if(!review){
      res.status(404)
      res.json({
        message: "Review couldn't be found"
      })
    }

    //confirm that review user id is current user id
    if(review.userId !== req.user.id){
      res.status(403)
      return res.json({
        message: "Forbidden"
      })
    };
    
    //review found and owned by logged in user - destroy
    const destroyedReview = await review.destroy();

    //return requested result
    res.json({
      message: "Successfully deleted"
    });
    
  } catch (error) {
    next(error)
  }
})





module.exports = router;