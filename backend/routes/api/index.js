const router = require('express').Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const spotsRouter = require('./spots.js'); //create a link to spots.js
const { restoreUser, requireAuth } = require("../../utils/auth.js");

// Connect restoreUser middleware to the API router
  // If current user session is valid, set req.user to the user in the database
  // If current user session is not valid, set req.user to null
  
router.use(restoreUser); //make sure this happens first ALWAYS

//login & logout
router.use('/session', sessionRouter);

//signup
router.use('/users', usersRouter);

//add new routes here (spots, reviews, etc.)
router.use('/spots', spotsRouter);

//testing that only logged in users can hit this route (requireAuth middleware)
router.get('/test', requireAuth, (req, res, next) => {
  try {
    res.json({
      message: 'success'
    });    
  } catch (error) {
    next(error)
  }
});

router.get('/', (req, res, next) => {
  try {
    res.json({
      message: ':)'
    })
    
  } catch (error) {
    next(error)
  }
})

router.post('/test', (req, res, next) => {
  try {
    res.json({requestBody: req.body});
  } catch (error) {
    next(error)
  }
});

module.exports = router;