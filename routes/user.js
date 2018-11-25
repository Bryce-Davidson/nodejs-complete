var express                   = require('express')
var router                    = express.Router()
const { isVerifiedGlobal }    = require('../util/middleware/Email-Verification');
const { isLoggedIn }          = require('../util/middleware/Authentication');
const { profile }             = require('../controllers/userController');

// require user to be logged in to access all routes
router.use(isLoggedIn, isVerifiedGlobal);

router.route('/profile')
  .get(profile.get)

module.exports = router;
