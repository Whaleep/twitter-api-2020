const sequelize = require('sequelize')
const { User, Tweet, Reply, Like } = require('../models')

const adminService = {
  getTweets: (req, res, callback) => {
    Tweet.findAll({ include: User, raw: true, nest: true })
      .then(tweets => {
        tweets = tweets.map(tweet => ({
          ...tweet,
          description: tweet.description.substring(0, 50)
        }))
        return callback({ tweets, status: '200' })
      })
      .catch(error => res.status(422).json(error))
  },
  removeTweet: (req, res, callback) => {
    TweetId = req.params.id
    return Promise.all([
      Tweet.destroy({ where: { id: TweetId } }),
      Like.destroy({ where: { TweetId } }),
      Reply.destroy({ where: { TweetId } })
    ])
      .then(([tweet, like, reply]) => {
        callback({ tweet, like, reply, status: '200' })
      })
      .catch(error => res.status(422).json(error))
  },
  getUsers: (req, res, callback) => {
    User.findAll({
      group: 'User.id',
      attributes: ['id', 'name', 'email', 'role', 'account', 'avatar', 'cover',
        [sequelize.literal('COUNT(DISTINCT Tweets.id)'), 'tweetsCount'],
        [sequelize.literal('COUNT(DISTINCT Likes.id)'), 'likesCount'],
        [sequelize.literal('COUNT(DISTINCT Followers.id)'), 'followingsCount'],
        [sequelize.literal('COUNT(DISTINCT Followings.id)'), 'followersCount']
      ],
      include: [
        { model: Tweet, attributes: [] },
        { model: Like, attributes: [] },
        { model: User, as: 'Followings', attributes: [], through: { attributes: [] } },
        { model: User, as: 'Followers', attributes: [], through: { attributes: [] } }
      ],
      order: [[sequelize.col('tweetsCount'), 'DESC'], ['id', 'ASC']],
      raw: true, nest: true
    })
      .then(users => callback({ users: users, status: '200' }))
  }
}

module.exports = adminService
