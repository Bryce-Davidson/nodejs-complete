const User                    = require('../models/User');
const nodemailer              = require('nodemailer');
const sgTransport             = require('nodemailer-sendgrid-transport');
const randomString            = require('randomstring');
const { SENDGRID_API_KEY }    = require('../config/keys');
const ejs                     = require('ejs');
const fs                      = require('fs');
const path                    = require("path");

// SIGNUP ---------------------------------------------------------------------
const signup = {
  get: async (req, res, next) => {
    res.render('auth/signup', { message: "ok" })
  }
}

// LOGIN ----------------------------------------------------------------------
const login = {
  get: async (req, res, next) => {
    res.render('auth/login', { message: "ok" })
  }
}

// LOGOUT ---------------------------------------------------------------------
const logout = {
  get: async (req, res, next) => {
    req.logout();
    req.session.destroy()
    res.redirect('/');
  }
}

// FORGOT ---------------------------------------------------------------------

const forgot = {
  get: async (req, res, next) => {
    res.render('auth/forgot')
  },

  post: async (req, res, next) => {
    var { email } = req.body;
    if (!email)
      res.send("Please include an email")
    


      const setRandomToken = email => 
        User
          .findOne({ 'local.email': email })
          .then((user) => {
            if (!user) {
              res.status(404)
                 .send('errors', { msg: 'Account with that email address does not exist.' });
            } else {
              let token = randomString.generate(32);
              user.passwordResetToken = token;
              user.passwordResetExpires = Date.now() + 3600000; // 1 hour
              user = user.save();
            }
            return user;
        });

      const sendResetEmail = async user => {
        var htmlstring = await fs.readFileSync(path.resolve(__dirname, "../emails/verify-email.ejs"), 'utf-8');
        var htmltosend = await ejs.render(htmlstring, {token: user.passwordResetToken});
        var sendGridOptions = {auth: {api_key: SENDGRID_API_KEY}}
        var mailer = nodemailer.createTransport(sgTransport(sendGridOptions));
        var resetEmail = {
        to: user.local.email,
        from: 'nodejs-password-reset',
        subject: 'Nodejs Password Reset',
        text: `Please click on the link to reset your password! \\n\\n 
            http://localhost:4000/reset/${user.passwordResetToken}`,
        html: htmltosend
        }
        return mailer.sendMail(resetEmail)
      } 
      
      setRandomToken(email)
        .then(sendResetEmail)
        .then(msg => res.send(msg))
        .catch(next)
  }
}

// FORGOT ---------------------------------------------------------------------

const reset = {
  get: async (req, res, next) => {
    res.render('auth/reset')
  },
  post: async (req, res, next) => {
    // find user by the token
    User.findOne({
      'passwordResetToken': req.params.token,
      'passwordResetExpires': { $gt: Date.now() }
    })
      .then(user => {
        if(!user)
          res.status(404).send({msg: "Reset token has expired"});
        user.passwordResetExpires = null;
        user.passwordResetToken   = null;
        user.local.password       = req.body.password;
        user.save()
          .then(user => res.send(user))
          .catch(next)
      })
      .catch(next)
  }
}

module.exports = {
  signup,
  login,
  logout,
  forgot,
  reset
}
