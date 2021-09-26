const bcrypt = require('bcryptjs')
const sequelize = require('sequelize')
const { User, Tweet, Like } = require('../models')

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
          isFollowed: req.user.Followings.map(d => d.id).includes(UserId)
        }
        callback(user)
      })
  }
}

module.exports = userService
