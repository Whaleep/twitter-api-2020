const bcrypt = require('bcryptjs')
const db = require('../../models')
const User = db.User

const userService = require('../../services/userService.js')

// JWT
const jwt = require('jsonwebtoken')
const passportJWT = require('passport-jwt')
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy

const userController = {
  register: (req, res) => {
    userService.register(req, res, (data) => res.json(data))
  },
  login: (req, res) => {
    // 檢查必要資料
    if (!req.body.email || !req.body.password) {
      return res.json({ status: 'error', message: 'requried fields didn\'t exist' })
    }
    // 檢查 user 是否存在與密碼是否正確
    const username = req.body.email
    const password = req.body.password

    User.findOne({ where: { email: username } }).then(user => {
      if (!user) return res.status(401).json({ status: 'error', message: 'no such user found' })
      if (!bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ status: 'error', message: 'passwords did not match' })
      }
      // 簽發 token
      const payload = { id: user.id }
      const token = jwt.sign(payload, process.env.JWT_SECRET)
      return res.json({ status: 'success', message: 'ok', token, user: { id: user.id, name: user.name, email: user.email, role: user.role } })
    })
  },
  getUser: (req, res) => {
    userService.getUser(req, res, (data) => res.json(data))
  }
}

module.exports = userController