const helpers = require('../_helpers')
const express = require('express')
const router = express.Router()

const tweetController = require('../controllers/api/tweetController')
const userController = require('../controllers/api/userController')

const passport = require('../config/passport')

// use helpers.getUser(req) to replace req.user
function authenticated(req, res, next) {
  passport.authenticate('jwt', { session: false }, (error, user, info) => {
    if (user) {
      req.user = user.dataValues
      return next()
    }
    return res.status(401).json({ message: '請先登入在使用' })
  })(req, res, next)
}

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

router.get('/users/:id', authenticated, authenticatedUser, userController.getUser)

router.get('/', (req, res) => res.redirect('home'))
router.get('/home', authenticated, authenticatedUser, tweetController.getHome)

module.exports = router
