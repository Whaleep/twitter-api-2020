const helpers = require('../_helpers')
const express = require('express')
const router = express.Router()

const tweetController = require('../controllers/tweetController')
const userController = require('../controllers/userController')
const adminController = require('../controllers/adminController')

const passport = require('../config/passport')

// 身分認證
const authenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next()
  }
  req.flash('error_messages', '帳號或密碼輸入錯誤')
  res.redirect('/login')
}

const authenticatedUser = (req, res, next) => {
  if (req.isAuthenticated()) {
    if (req.user.role === 'user') { return next() }
  }
  req.flash('error_messages', '帳號或密碼輸入錯誤')
  res.redirect('/login')
}

const authenticatedAdmin = (req, res, next) => {
  if (req.isAuthenticated()) {
    if (req.user.role === 'admin') { return next() }
  }
  req.flash('error_messages', '帳號或密碼輸入錯誤')
  res.redirect('/admin/login')
}

router.get('/register', (req, res) => res.render('register', { api: false }))
router.post('/users', userController.register)
router.get('/login', (req, res) => res.render('login', { api: false }))
router.post('/login', passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), userController.login)
router.get('/logout', userController.logout)

router.get('/profile', authenticated, userController.getUser)
router.get('/users/:id', authenticatedUser, userController.getUser)

router.get('/', (req, res) => res.redirect('home'))
router.get('/home', authenticatedUser, tweetController.getHome)

router.get('/admin', (req, res) => res.redirect('/admin/tweets'))
router.get('/admin/login', (req, res) => res.render('admin/login', { api: false }))
router.post('/admin/login', passport.authenticate('local', { failureRedirect: '/admin/login', failureFlash: true }), adminController.login)
router.get('/admin/tweets', authenticatedAdmin, adminController.getTweets)
router.delete('/admin/tweets/:id', authenticatedAdmin, adminController.removeTweet)
router.get('/admin/users', authenticatedAdmin, adminController.getUsers)

module.exports = router
