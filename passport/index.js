const local = require('./localStrategy');
const {User} = require('../models');

module.exports = (passport) => {
    passport.serializeUser((user, done) => {
        console.log('=======================serializeUser');
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        console.log('=======================deserializeUser');
        User.findOne({
            where : {id},
        })
            .then(user => done(null, user))
            .catch(err => done(err));
    });
    local(passport);
}