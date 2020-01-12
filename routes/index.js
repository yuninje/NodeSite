const express = require('express');

const router = express.Router();
const commentRouter = require('./comment');
const postRouter = require('./post');
const userRouter = require('./user');
const authRouter = require('./auth');


router.get('/', (req, res) =>{
	res.render('index', {
        title : '홈페이지',
        user : req.user,
    });
});

router.use('/comments', commentRouter);
router.use('/posts', postRouter);
router.use('/users', userRouter);
router.use('/auth', authRouter);

module.exports = router;