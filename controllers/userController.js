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
  },
  getProfile: (req, res) => {
    userService.getProfile(req, res, (data) => res.render('profile', data))
  },
  getUser: (req, res) => {
    userService.getUser(req, res, (data) => res.render('profile', data))
  },
  addFollowing: (req, res) => {
    userService.addFollowing(req, res, (data) => {
      if (data['status'] === '200') {
        req.flash('success_messages', data['message'])
        return res.redirect('back')
      }
      req.flash('error_messages', data['message'])
      return res.redirect('back')
    })
  },
  removeFollowing: (req, res) => {
    userService.removeFollowing(req, res, (data) => {
      if (data['status'] === '200') {
        res.redirect('back')
      }
    })
  },
  addSubscribe: (req, res) => {
    userService.addSubscribe(req, res, (data) => {
      if (data['status'] === '200') {
        req.flash('success_messages', data['message'])
        return res.redirect('back')
      }
      req.flash('error_messages', data['message'])
      return res.redirect('back')
    })
  },
  removeSubscribe: (req, res) => {
    userService.removeSubscribe(req, res, (data) => {
      if (data['status'] === '200') {
        res.redirect('back')
      }
    })
  },
  getNotifications: (req, res) => {
    userService.getNotifications(req, res, (data) => res.json(data))
  }
}

module.exports = userController
