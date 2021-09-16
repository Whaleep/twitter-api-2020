const helpers = require('../_helpers')
const express = require('express')
const router = express.Router()

const tweetController = require('../controllers/api/tweetController')
const userController = require('../controllers/api/userController')

const passport = require('../config/passport')

// use helpers.getUser(req) to replace req.user
// function authenticated(req, res, next) {
//   passport.authenticate('jwt', { session: false })
// }

const authenticated = passport.authenticate('jwt', { session: false })

const authenticatedUser = (req, res, next) => {
  // return next()
  if (req.user) {
    if (req.user.role === 'user') { return next() }
    return res.json({ status: 'error', message: 'permission denied' })
  } else {
    return res.json({ status: 'error', message: 'permission denied' })
  }
}

const authenticatedAdmin = (req, res, next) => {
  // return next()
  if (req.user) {
    if (req.user.role === 'admin') { return next() }
    return res.json({ status: 'error', message: 'permission denied' })
  } else {
    return res.json({ status: 'error', message: 'permission denied' })
  }
}

router.get('/register', (req, res) => res.render('register', { api: true }))
router.post('/users', userController.register)
router.get('/login', (req, res) => res.render('login', { api: true }))
router.post('/login', userController.login)



router.get('/', (req, res) => res.redirect('home'))
router.get('/home', authenticated, authenticatedUser, tweetController.getHome)

module.exports = router
