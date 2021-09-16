const helpers = require('../_helpers')
const express = require('express')
const router = express.Router()

const tweetController = require('../controllers/tweetController')
const userController = require('../controllers/userController')

const passport = require('../config/passport')

// 身分認證
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
  res.redirect('/login')
}

router.get('/register', (req, res) => res.render('register', { api: false }))
router.post('/users', userController.register)
router.get('/login', (req, res) => res.render('login', { api: false }))
router.post('/login', passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), userController.login)
router.get('/logout', userController.logout)

router.get('/', (req, res) => res.redirect('home'))
router.get('/home', authenticatedAdmin, tweetController.getHome)

module.exports = router
