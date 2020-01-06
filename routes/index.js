const express = require('express');

const router = express.Router();
const postRouter = require('./post');


router.get('/', (req, res) =>{
	res.render('index');
});

router.use('/posts', postRouter);

module.exports = router;