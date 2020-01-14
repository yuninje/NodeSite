const express = require('express');
const passport = require('passport');		// 로그인을 쉽게 할 수 있게 도와주는 모듈
const {isLoggedIn, isNotLoggedIn } = require('./middlewares');
const router = express.Router();

const {User} = require('../models');

// 회원가입 페이지
router.get('/join', isNotLoggedIn, async (req, res) => {
	res.render('auth/join', {
        title : '회원가입',
        joinError : req.flash('joinError')
    });
});

// 회원가입 액션
router.post('/', isNotLoggedIn,async (req, res, next) => {
    const email = req.body.email;
    const nick = req.body.nick;
    const name = req.body.name;
    const password = req.body.password;
	try{
        const findUser = await User.findOne({where : { email : email}});
        if(findUser){
            req.flash('joinError', '이미 존재하는 이메일');
            return res.redirect('/auth/join');
        }
		const user = await User.create({
			email : email,
			nick : nick,
			name : name,
			password : password,
		});
		res.redirect('auth/login');
	}catch(error){
		console.error(error);
		next(error);
	}
});

// 로그인 페이지
router.get('/login', isNotLoggedIn, (req, res) => {
	res.render('auth/login', {
		title : '로그인',
        user : req.user,
        loginError : req.flash('loginError'),
	});
});

// 로그인 액션
router.post('/login', isNotLoggedIn, async (req, res, next) => {
	passport.authenticate('local', (authError, user, info) =>{
		if(authError){
			console.error(authError);
			return next(authError);
		}
		if(!user){
			req.flash('loginError', info.message);
			return res.redirect('/auth/login');
		}
		return req.login(user, (loginError) => {
			if(loginError){
				console.error(loginError);
				return next(loginError);
			}
			return res.redirect('/');
		});
	})(req, res, next);
});

// 로그아웃 액션
router.get('/logout', isLoggedIn, (req, res) =>{
    req.logout();
    req.session.destroy();
    res.redirect('/');
})

module.exports = router;