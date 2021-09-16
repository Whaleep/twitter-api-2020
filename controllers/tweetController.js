const tweetService = require('../services/tweetService.js')

const tweetController = {
  getHome: (req, res) => {
    tweetService.getHome(req, res, (data) => res.render('home', data))
  }
}

module.exports = tweetController
