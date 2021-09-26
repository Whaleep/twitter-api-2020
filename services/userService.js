const helpers = require('../_helpers')
const bcrypt = require('bcryptjs')
const sequelize = require('sequelize')
const Op = sequelize.Op
const { User, Tweet, Reply, Like, Followship, Subscribe } = require('../models')

const userService = {
  register: (req, res, callback) => {
    const { account, name, email, password, checkPassword } = req.body
    const errors = []
    if (!account || !name || !email || !password || !checkPassword) errors.push('所有欄位都是必填項')
    if (name && name.length > 50) errors.push('名稱需小於50字')
    if (checkPassword !== password) errors.push('兩次密碼輸入不同！')

    return Promise.all([
      User.findOne({ where: { account } }),
      User.findOne({ where: { email } })
    ]).then(([account, email]) => {
      if (account) errors.push('account 已重覆註冊！')
      if (email) errors.push('email 已重覆註冊！')
      if (errors.length) { return callback({ status: 'error', message: errors }) }
      else {
        return User.create({
          ...req.body,
          avatar: `https://loremflickr.com/320/320/model/?lock=${Math.random() * 100}`,
          cover: `https://loremflickr.com/600/200/nature/?lock=${Math.random() * 100}`,
          role: 'user',
          password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
        })
          .then(user => {
            return callback({ status: 'success', message: '成功註冊帳號！' })
          })
          .catch(error => res.status(400).json(error))
      }
    })
  },
  getUser: (req, res, callback) => {
    const UserId = Number(req.params.id) || req.user.id
    return User.findByPk(UserId, {
      attributes: ['id', 'name', 'account', 'email', 'role', 'avatar', 'cover',
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
      ]
    })
      .then(user => {
        user = {
          ...user.toJSON(),
          isFollowed: req.user.Followings.map(d => d.id).includes(UserId),
          isSubscribed: req.user.Subscribed.map(d => d.id).includes(UserId)
        }
        callback(user)
      })
  },
  addFollowing: (req, res, callback) => {
    if (req.user.id === Number(req.body.id)) {
      return callback({ status: '400', message: '不能追蹤自己' })
    }
    return Followship.create({ followerId: req.user.id, followingId: req.body.id })
      .then(followship => callback({ followship: followship.toJSON(), status: '200', message: 'success' }))
      .catch(error => res.status(422).json(error))
  },
  removeFollowing: (req, res, callback) => {
    return Followship.findOne({ where: { followerId: req.user.id, followingId: req.params.followingId } })
      .then(followship => {
        followship.destroy()
          .then(followship => callback({ followship: followship.toJSON(), status: '200', message: 'success' }))
          .catch(error => res.status(422).json(error))
      })
  },
  addSubscribe: (req, res, callback) => {
    if (req.user.id === Number(req.params.id)) {
      return callback({ status: '400', message: '不能訂閱自己' })
    }
    return Subscribe.create({ subscriberId: req.user.id, subscribedId: req.params.id })
      .then(notice => callback({ notice: notice.toJSON(), status: '200', message: 'success' }))
      .catch(error => res.status(422).json(error))
  },
  removeSubscribe: (req, res, callback) => {
    return Subscribe.findOne({ where: { subscriberId: req.user.id, subscribedId: req.params.id } })
      .then(subscribe => {
        subscribe.destroy()
          .then(subscribe => callback({ subscribe: subscribe.toJSON(), status: '200', message: 'success' }))
          .catch(error => res.status(422).json(error))
      })
  },
  getNotifications: (req, res, callback) => {
    Promise.all([
      Subscribe.findAll({ where: { subscriberId: req.user.id }, attributes: ['subscribedId'], raw: true, nest: true }),
      Tweet.findAll({ where: { UserId: req.user.id }, attributes: ['id'], raw: true, nest: true })
    ])
      .then(([subscribed, tweets]) => {
        subscribed = Array.from(subscribed, r => r.subscribedId)
        tweets = Array.from(tweets, r => r.id)
        Promise.all([
          Tweet.findAll({ where: { UserId: { [Op.in]: subscribed } } }),
          Reply.findAll({ where: { [Op.or]: [{ UserId: { [Op.in]: subscribed } }, { TweetId: { [Op.in]: tweets } }] } }),
          Followship.findAll({ where: { followingId: req.user.id } }),
          Like.findAll({ where: { TweetId: { [Op.in]: tweets } } })
        ])
          .then(([tweets, replies, following, like]) => callback({ tweets, replies, following, like }))
      })
  }
}

module.exports = userService
