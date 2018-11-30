const mongoose = require('mongoose');
const bcrypt   = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({
  method: {
    type: String,
    enum: ['local', 'google', 'facebook']
  },
  local: {
    email: {
      type: String,
      lowercase: true
    },
    password: String,
  },
  google: {
    id: String,
    email: {
      type: String,
      lowercase: true
    },
    name: String,
    token: String
  },
  facebook: {
    id: String,
    name: String,
    token: String
  },
  isVerified: {
    type: Boolean,
    default: false,
    required: true
  },
  passwordResetToken: String,
  passwordResetExpires: Date
});

userSchema.pre('save', function(next) {
  const user = this;
  if(!this.isModified('method'))
    return next();
  else if (this.isModified('method') && user.method !== 'local') {
    user.isVerified = true;
  } 
  next()
})

userSchema.pre('save', function save(next) {
  const user = this;
  if (!user.isModified('local.password')) { return next(); }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) { return next(err); }
    bcrypt.hash(user.local.password, salt, null, (err, hash) => {
      if (err) { return next(err); }
      user.local.password = hash;
      next();
    });
  });
});


userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', userSchema);
