// MODELS
const User = require('../models/User')

profile = {
  get: async (req, res, next) => {
    res.send('Profile')
  }
}

module.exports = { profile }
