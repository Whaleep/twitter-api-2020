const express = require('express')
const router = express.Router()

const tweetController = require('../controllers/api/tweetController')

// use helpers.getUser(req) to replace req.user
function authenticated(req, res, next) {
  // passport.authenticate('jwt', { ses...
};

router.get('/', (req, res) => res.redirect('home'))
router.get('/home', tweetController.getHome)

module.exports = router
