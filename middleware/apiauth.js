const helpers = require('../_helpers')
const passport = require('../config/passport')

function authenticated(req, res, next) {
  passport.authenticate('jwt', { session: false }, (error, user, info) => {
    if (user) {
      req.user = user.dataValues
      return next()
    }
    return res.status(401).json({ message: '請先登入在使用' })
  })(req, res, next)
}

const authenticatedUser = (req, res, next) => {
  if (req.user) {
    if (req.user.role === 'user') { return next() }
    return res.json({ status: 'error', message: '管理員不可登入前台' })
  } else {
    return res.json({ status: 'error', message: '請先登入在使用' })
  }
}

const authenticatedAdmin = (req, res, next) => {
  if (helpers.getUser(req)) {
    if (helpers.getUser(req).role === 'admin') { return next() }
    return res.json({ status: 'error', message: '普通用戶不可登入後台' })
  } else {
    return res.json({ status: 'error', message: '請先登入在使用' })
  }
}

module.exports = {
  authenticated, authenticatedUser, authenticatedAdmin
}