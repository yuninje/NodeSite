const express = require('express');
const passport = require('passport');		// 로그인을 쉽게 할 수 있게 도와주는 모듈
const {isLoggedIn, isNotLoggedIn } = require('./middlewares');
const router = express.Router();

const {User} = require('../models');

router.get('/join', async (req, res) => {
	res.render('auth/join');
});

router.post('/', async (req, res, next) => {
	try{
		const user = await User.create({
			email : req.body.email,
			name : req.body.name,
			password : req.body.password,
		});
		res.redirect('auth/login');
	}catch(error){
		console.error(error);
		next(error);
	}
});

router.get('/login', (req, res) => {
	res.render('auth/login', {
		title : '로그인',
        user : req.user,
        joinError : req.flash('loginError'),
	});
});

router.post('/login', async (req, res, next) => {
	passport.authenticate('local', (authError, user, info) =>{
		if(authError){
			console.error(authError);
			return next(authError);
		}
		if(!user){
			req.flash('loginError', info.message);
			return res.redirect('/');
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



module.exports = router;