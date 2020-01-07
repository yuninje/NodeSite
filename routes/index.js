const express = require('express');

const router = express.Router();
const postRouter = require('./post');
const userRouter = require('./user');
const authRouter = require('./auth');


router.get('/', (req, res) =>{
	res.render('index');
});

router.use('/posts', postRouter);
router.use('/users', userRouter);
router.use('/auth', authRouter);

module.exports = router;