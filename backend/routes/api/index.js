const router = require('express').Router();
const { restoreUser } = require('../../utils/auth.js');

// Connect restoreUser middleware to the API router
  // If current user session is valid, set req.user to the user in the database
  // If current user session is not valid, set req.user to null
router.use(restoreUser);

router.post('/test', (req, res, next) => {
  try {
    res.json({requestBody: req.body});
  } catch (error) {
    next(error)
  }
})

module.exports = router;