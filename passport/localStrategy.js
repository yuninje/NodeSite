const LocalStrategy = require('passport-local').Strategy;

const {User} = require('../models');

module.exports = (passport) => {
    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, async (email, password, done) => {
        try {
            const exUser = await User.findOne({where : {email}});
            if(exUser){
                const result = exUser.password == password;
                if (result){
                    done(null, exUser);
                }else{
                    done(null, false, {message: ' 비밀번호 틀림'});
                }
            }else{
                done(null, false, {message:'가입되지않음'});
            }
        }catch(error){
            console.error(error);
            done(error);
        }
    }));
};