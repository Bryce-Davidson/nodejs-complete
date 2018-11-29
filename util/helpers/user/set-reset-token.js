const randomString          = require('randomstring');

exports.setTokenOnUser = user => {
    let token = randomString.generate(32);
    user.passwordResetToken = token;
    user.passwordResetExpires = Date.now() + 3600000; // 1 hour
    user = user.save();
    return user;
}