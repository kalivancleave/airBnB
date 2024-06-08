const express = require('express');

const { requireAuth } = require('../../utils/auth');
const { Spot, SpotImage, Review, User, ReviewImage } = require('../../db/models');

const {check} = require('express-validator');
const {handleValidationErrors} = require('../../utils/validation');

const router = express.Router();


//test router
router.get('/', async(req, res, next) => {
  try {
    res.json(":)")
    
  } catch (error) {
    next(error)
  }
});

router.delete('/:imageId', requireAuth, async(req, res, next) => {
  try {
    //find spot image id
    const spotImageId = req.params.imageId;

    //find spot image by id
    const spotImage = await SpotImage.findByPk(spotImageId);

    //404 - spot image not found
    if(!spotImage){
      res.status(404)
      return res.json({
        message: "Spot Image couldn't be found"
      })
    };

    //spot image found
    //Authorization: make sure logged in user owns spot
    const spot = await Spot.findOne({
      where: {
        id: spotImage.spotId
      }
    });

    if(spot.ownerId !== req.user.id){
      return res.json({
        message: "You are not authorized to delete this image."
      })
    }

    //passes restrictions spot image .destroy
    const destroyedSpotImage = spotImage.destroy();

    //return requested response
    res.json({
      message: "Successfully deleted"
    });

  } catch (error) {
    next(error)
  }
});





module.exports = router;