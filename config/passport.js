const keys               = require('./keys.js');
const User               = require('../models/User');
const passport           = require('passport');
var LocalStrategy        = require('passport-local').Strategy;
var GoogleStrategy       = require('passport-google-oauth20').Strategy;
var FacebookStrategy     = require('passport-facebook').Strategy;

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    done(null, id);
});

// LOCAL ----------------------------------------------------------------------

// SIGNUP ---------------------------------------------------------------------

passport.use('local-signup', new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true
}, (req, email, password, done) => {
    User.findOne({ 'local.email' :  email }, function(err, user) {
        if (err)
            return done(err);
        if (user) {
            return done(null, false);
        } else {
            let newUser = new User({
              'method'          :'local',
              'local.email'     :email,
              'local.password'  :password
            });
            newUser.save(function(err, user ) {
                if (err)
                    return done(err);
                // serialize the newUser
                return done(null, user);
            })
          }
        })
      }));

// LOGIN ----------------------------------------------------------------------

passport.use('local-login', new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password',
},
  (email, password, done) => {
    User.findOne({ 'local.email' :  email }) 
        .then(user => {
            if (!user)
                done(null, false);
            if (!user.validPassword(password))
                done(null, false);
            else
                return done(null, user);
            })
            .catch(err => done(err))
}));


// GOOGLE AUTH ----------------------------------------------------------------

passport.use(
    new GoogleStrategy({
        clientID: keys.AUTH.GOOGLE.CLIENT_ID,
        clientSecret: keys.AUTH.GOOGLE.SECRET,
        callbackURL: `${keys.HTTPDOMAIN}/auth/google/callback`
    }, (accessToken, refreshToken, profile, done) => {
        User.findOne({'google.id': profile.id})
          .then(user => {
            if (user)
              return done(null, user)
            else {
              let newGoogleUser = new User({
                'method'        :'google',
                'isVerified'    : true,
                'google.id'     :profile.id,
                'google.email'  :profile.emails[0].value,
                'google.token'  :accessToken,
                'google.name'   :profile.displayName,
              });
              newGoogleUser.save(function(err, user) {
                  if (err)
                      return done(err);
                  return done(null, user);
              });
            }
        })
    }));

// FACEBOOK -------------------------------------------------------------------

passport.use(new FacebookStrategy({
    clientID: keys.AUTH.FACEBOOK.APP_ID,
    clientSecret: keys.AUTH.FACEBOOK.SECRET,
    callbackURL: `${keys.HTTPDOMAIN}/auth/facebook/callback`,
    profileFields: ['id', 'displayName', 'email']
  }, (accessToken, refreshToken, profile, done) => {
      console.log(profile);
      User.findOne({'faebook.id': profile.id})
        .then(user => {
          if (user)
            return done(null, user)
          else {
            var newUser = new User({
                "newUser.method"         :'facebook',
                'isVerified'             : true,
                "newUser.facebook.id"    :profile.id,
                "newUser.facebook.name"  :profile.displayName,
                "newUser.facebook.email" :profile.email,
                "newUser.facebook.token" :accessToken
            })
            newUser.save(function(err, user) {
              if (err)
                return done(err);
              else
                return done(null, user);
            })
          }
      });
  }
));

module.exports = passport;
