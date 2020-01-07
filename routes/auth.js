const express = require('express');
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
	res.render('auth/login');
});

router.post('/login', async (req, res, next) => {
	try{
		const user = await User.findOne({where : {email : req.body.email}});
		if(user){
			if(user.password == req.body.password){
				// 로그인
			}
			// 비밀번호 틀림
		}
		// 아이디 존재하지 않음
	}catch(error){
		console.error(error);
		next(error);
	}
});



module.exports = router;