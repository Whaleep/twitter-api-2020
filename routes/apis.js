const express = require('express')
const router = express.Router()

const tweetController = require('../controllers/api/tweetController')

router.get('/', (req, res) => res.redirect('home'))
router.get('/home', tweetController.getHome)

module.exports = router
