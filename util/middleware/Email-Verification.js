const User = require('../../models/User')

module.exports = {
    isVerifiedLogIn: (req, res, next) => {
        var { email } = req.body;
        User.findOne({'local.email': email})
            .then(user => {
                if (user.isVerified)
                    next();
                else
                    res.send('Please verify email');
            })
            .catch(err => next(err));
    },
    isVerifiedGlobal: (req, res, next) => {
        User.findById(req.user)
            .then(user => {
                if (user.isVerified)
                    return next();
                else
                     res.send("Please verify email GLOBAL");
            })
            .catch(err => next(err));
    }
}