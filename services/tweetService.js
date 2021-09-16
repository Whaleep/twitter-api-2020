const db = require('../models')
const { User, Tweet, Reply, Like } = db

const tweetService = {
  getHome: (req, res, callback) => {
    Tweet.findAll({ include: [User, Reply, Like], order: [['createdAt', 'DESC']] })
      .then(tweets => {
        tweets = tweets.map(tweet => ({
          id: tweet.id,
          description: tweet.description,
          createdAt: tweet.createdAt,
          User: tweet.User.dataValues,
          replyCount: tweet.Replies.length,
          likeCount: tweet.Likes.length
        }))
        callback({ tweets })
      })
  }
}

module.exports = tweetService
