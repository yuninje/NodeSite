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
		
	}catch(error){
		console.error(error);
		next(error);
	}
});



module.exports = router;