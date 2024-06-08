const express = require('express');

const { requireAuth } = require('../../utils/auth');
const { Spot, SpotImage, Review, User, ReviewImage } = require('../../db/models');

const {check} = require('express-validator');
const {handleValidationErrors} = require('../../utils/validation');

const router = express.Router();

//test route
router.get('/', async(req, res, next) => {
  try {
    res.json(":)")
    
  } catch (error) {
    next(error)
  }
})

router.delete('/:imageId', requireAuth, async(req, res, next) => {
  try {
    //find review image id
    const reviewImageId = req.params.imageId;

    //find review image by id
    const reviewImage = await ReviewImage.findByPk(reviewImageId);

    //404 - no review image found
    if(!reviewImage){
      res.status(404)
      return res.json({
        message: "Review Image couldn't be found"
      })
    }

    //Authorization: review must belong to the current user
    const review = await Review.findOne({
      where: {
        id: reviewImage.reviewId
      }
    });

    if(review.userId !== req.user.id){
      return res.json({
        message: "You are not authorized to delete this image."
      })
    };

    //passes all requirements - destroy
    const destroyedReviewImage = await reviewImage.destroy();

    //return requested response
    res.json({
      message: "Successfully deleted"
    });
    
  } catch (error) {
    next(error)
  }
})


module.exports = router;