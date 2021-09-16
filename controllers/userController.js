const userService = require('../services/userService.js')

const userController = {
  login: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/home')
  }
}

module.exports = userController
