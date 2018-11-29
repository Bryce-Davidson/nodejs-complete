const express          = require('express');
const passport         = require('passport');
const bodyParser       = require('body-parser');
const cookieParser     = require('cookie-parser');
const session          = require('express-session');
const MongoStore       = require('connect-mongo')(session);
const morgan           = require('morgan');
const db               = require('./database');
const helmet           = require('helmet')
const rateLimit        = require('express-rate-limit');
const { SESSION_KEYS } = require('./config/keys.js')

// APP GLOBALS
const oneDay = 86400000;

// EXPRESS
var app = express()
app.set('view engine', 'ejs');

// MIDDLE WEAR ----------------------------------------------------------------
app.use(helmet());
app.use(rateLimit({
  windowMs: 20 * 60 * 1000, // 20 minutes
  max: 100 // 100 requests per 15 minutes
}));
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  name: "ml-co923bk-we23",
  secret: SESSION_KEYS,
  resave: false,
  saveUninitialized: true,
  store: new MongoStore({ mongooseConnection: db }),
  cookie: {
    maxAge: oneDay,
    httpOnly: true
  }
}));
app.use(passport.initialize());
app.use(passport.session());

// ERROR HANDLING ------------------------------------------------------------
app.use((err, req, res, next) => {
    if (err) {
      console.error(err);
      res.status(500).send({msg: "Internal Server Error 500"})
    }
    else
      next();
});

// ROUTES ---------------------------------------------------------------------
app.use('/', require('./routes/auth'));
app.use('/user', require('./routes/user'));

// INDEX ----------------------------------------------------------------------
app.get('/', (req, res, next) => {
  if (req.isAuthenticated())
    res.render('home/index', { isLoggedIn: true})
  else
    res.render('home/index', { isLoggedIn: false })
});

module.exports = app;