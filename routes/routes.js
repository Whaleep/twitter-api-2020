const helpers = require('../_helpers')
const express = require('express')
const router = express.Router()

const tweetController = require('../controllers/tweetController')
const userController = require('../controllers/userController')

const passport = require('../config/passport')

// 身分認證
const authenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    // if (helpers.ensureAuthenticated(req)) {
    return next()
  }
  res.redirect('/login')
}

const authenticatedUser = (req, res, next) => {
  if (req.isAuthenticated()) {
    if (req.user.role === 'user') { return next() }
    // if (helpers.ensureAuthenticated(req)) {
    //   if (helpers.getUser(req).isAdmin) { return next() }
  }
  req.flash('error_messages', '帳號或密碼輸入錯誤')
  res.redirect('/login')
}

router.get('/', (req, res) => res.redirect('home'))
router.get('/home', authenticatedUser, tweetController.getHome)

router.get('/login', (req, res) => res.render('login'))
router.post('/login', passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), userController.login)

module.exports = router
