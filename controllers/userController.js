const userService = require('../services/userService.js')

const userController = {
  register: (req, res) => {
    userService.register(req, res, (data) => {
      if (data['status'] === 'error') {
        req.flash('error_messages', data['message'])
        return res.redirect('back')
      }
      req.flash('success_messages', data['message'])
      res.redirect('/login')
    })
  },
  login: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/home')
  },
  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/login')
  }
}

module.exports = userController
