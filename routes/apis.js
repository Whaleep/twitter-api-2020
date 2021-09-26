const helpers = require('../_helpers')
const express = require('express')
const router = express.Router()
const { authenticated, authenticatedUser, authenticatedAdmin } = require('../middleware/apiauth')
const tweetController = require('../controllers/api/tweetController')
const userController = require('../controllers/api/userController')
const adminController = require('../controllers/api/adminController')

router.use((req, res, next) => {
  res.locals.api = true
  next()
})

router.get('/register', (req, res) => res.render('register'))
router.post('/users', userController.register)
router.get('/login', (req, res) => res.render('login'))
router.post('/login', userController.login)

router.get('/profile', authenticated, userController.getUser)
router.get('/users/:id', authenticated, authenticatedUser, userController.getUser)
router.post('/followships', authenticated, authenticatedUser, userController.addFollowing)
router.delete('/followships/:followingId', authenticated, authenticatedUser, userController.removeFollowing)
router.post('/subscribe/:id', authenticated, authenticatedUser, userController.addSubscribe)
router.delete('/subscribe/:id', authenticated, authenticatedUser, userController.removeSubscribe)
router.get('/notifications', authenticated, authenticatedUser, userController.getNotifications)

router.get('/', (req, res) => res.redirect('home'))
router.get('/home', authenticated, authenticatedUser, tweetController.getHome)

router.get('/admin', (req, res) => res.redirect('/admin/tweets'))
router.get('/admin/login', (req, res) => res.render('admin/login'))
router.post('/admin/login', userController.login)
router.get('/admin/tweets', authenticated, authenticatedAdmin, adminController.getTweets)
router.delete('/admin/tweets/:id', authenticated, authenticatedAdmin, adminController.removeTweet)
router.get('/admin/users', authenticated, authenticatedAdmin, adminController.getUsers)

module.exports = router
