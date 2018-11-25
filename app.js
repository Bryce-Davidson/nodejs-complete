const express          = require('express');
const passport         = require('passport');
const bodyParser       = require('body-parser');
const cookieParser     = require('cookie-parser');
const session          = require('express-session');
const MongoStore       = require('connect-mongo')(session);
const morgan           = require('morgan');
const db               = require('./database');
const helmet           = require('helmet')
const { SESSION_KEYS } = require('./config/keys.js')
const rateLimit        = require('express-rate-limit');

// APP GLOBALS
const oneDay = 86400000;

// EXPRESS
var app = express()
app.set('view engine', 'ejs');

// MIDDLE WEAR ----------------------------------------------------------------
app.use(helmet());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100 
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
    // TODO: Open these options for security
    httpOnly: true
    // secure: true,
    // makes sure the client can't see the cookies
    // domain: 'example.com', makes sure we are only getting cookies from a ertain domain
    // path: 'foo/bar'  
  }
}));
app.use(passport.initialize());
app.use(passport.session());

// ERROR HANDLING ------------------------------------------------------------
app.use((err, req, res, next) => {
    if (err)
      console.error(err);
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
