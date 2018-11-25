var nodemailer              = require('nodemailer');
var sgTransport             = require('nodemailer-sendgrid-transport');
const { SENDGRID_API_KEY }  = require('../config/keys').SENDGRID_API_KEY;



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
      var sendGridOptions = {auth: {api_key: SENDGRID_API_KEY}}
      var mailer = nodemailer.createTransport(sgTransport(sendGridOptions));
      var email = {
        to: ['lifebryce@gmail.com'],
        from: 'roger@tacos.com',
        subject: 'Hi there',
        text: 'Awesome sauce',
        html: '<b>Awesome sauce</b>'
    };
    
    mailer.sendMail(email, function(err, info) {
        if (err) { 
            console.log(err) 
            return res.send(err);
        } else {
          console.log(res);
        return res.send(info)
        }        
    });
  }
}

module.exports = {
  signup,
  login,
  logout,
  forgot
}
