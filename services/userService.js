const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User

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
    return User.findByPk(req.params.id, {
      include: [{ model: User, as: 'Followings' }, { model: User, as: 'Followers' },]
    })
      .then(user => {
        user = {
          user: user.id,
          name: user.name,
          account: user.account,
          email: user.email,
          avatar: user.avatar,
          cover: user.cover,
          followingCount: user.Followings.length,
          followerCount: user.Followers.length
        }
        callback(user)
      })
  }
}

module.exports = userService
