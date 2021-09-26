const helpers = require('../_helpers')
const express = require('express')
const router = express.Router()

const tweetController = require('../controllers/api/tweetController')
const userController = require('../controllers/api/userController')
const adminController = require('../controllers/api/adminController')

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
  if (req.user) {
    if (req.user.role === 'user') { return next() }
    return res.json({ status: 'error', message: 'permission denied' })
  } else {
    return res.json({ status: 'error', message: 'permission denied' })
  }
}

const authenticatedAdmin = (req, res, next) => {
  if (helpers.getUser(req)) {
    if (helpers.getUser(req).role === 'admin') { return next() }
    return res.json({ status: 'error', message: 'permission denied' })
  } else {
    return res.json({ status: 'error', message: 'permission denied' })
  }
}

router.use((req, res, next) => {
  res.locals.api = true
  next()
})

router.get('/register', (req, res) => res.render('register'))
router.post('/users', userController.register)
router.get('/login', (req, res) => res.render('login'))
router.post('/login', userController.login)

router.get('/users/:id', authenticated, authenticatedUser, userController.getUser)

router.get('/', (req, res) => res.redirect('home'))
router.get('/home', authenticated, authenticatedUser, tweetController.getHome)

router.get('/admin', (req, res) => res.redirect('/admin/tweets'))
router.get('/admin/login', (req, res) => res.render('admin/login'))
router.post('/admin/login', userController.login)
router.get('/admin/tweets', authenticated, authenticatedAdmin, adminController.getTweets)
router.delete('/admin/tweets/:id', authenticated, authenticatedAdmin, adminController.removeTweet)
router.get('/admin/users', authenticated, authenticatedAdmin, adminController.getUsers)

module.exports = router
