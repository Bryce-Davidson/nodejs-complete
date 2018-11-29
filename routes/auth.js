var express                   = require('express')
var router                    = express.Router()
const User                    = require('../models/User');
const passport                = require('../config/passport');
const GOOGLE_SCOPES           = require('../config/keys').AUTH.GOOGLE.SCOPES;
const FACEBOOK_SCOPES         = require('../config/keys').AUTH.FACEBOOK.SCOPES;
const { loggedInRedirect }    = require('../util/middleware/Authentication');
const { isVerifiedLogIn }     = require('../util/middleware/Email-Verification');
const {
  signup,
  login,
  logout,
  forgot,
  reset
  }                     = require('../controllers/authController');

// LOCAL AUTH -----------------------------------------------------------------

router.route('/signup')
  .get(signup.get)
  .post(passport.authenticate('local-signup', {
      successRedirect : '/user/profile',
      failureRedirect : '/signup',
      failureFlash : true
  }));

router.route('/login')
  .get(loggedInRedirect, login.get)
  .post(isVerifiedLogIn, passport.authenticate('local-login', {
      successRedirect : '/user/profile',
      failureRedirect : '/login',
      failureFlash : true
  }));

// GOOGLE AUTH ----------------------------------------------------------------

router.route('/auth/google')
  .get(passport.authenticate('google', { scope: GOOGLE_SCOPES }));

router.route('/auth/google/callback')
  .get(passport.authenticate('google', {
      failureRedirect: '/',
      successRedirect: '/user/profile'
    }));

// FACEBOOK AUTH --------------------------------------------------------------

router.route('/auth/facebook')
  .get(passport.authenticate('facebook', { scope: FACEBOOK_SCOPES }));


router.route('/auth/facebook/callback')
  .get(passport.authenticate('facebook', {
    failureRedirect: '/login',
    successRedirect: '/user/profile'
  }));


// PASSWORD RESET -------------------------------------------------------------
router.route('/forgot')
  .get(forgot.get)
  // set reset token
  // send reset token
  .post(forgot.post)

router.route('/reset/:token')
  .get(reset.get)
  .post(reset.post)

// LOGOUT ---------------------------------------------------------------------
router.route('/logout')
  .get(logout.get)

module.exports = router;
