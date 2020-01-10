const express = require('express');
const router = express.Router();
const dateFormat = require('dateformat');
const {isLoggedIn, isNotLoggedIn } = require('./middlewares');

const { Post, Comment } = require('../models');

const addDate = (object) => object.date = dateFormat(object.createdAt, "yyyy.mm.dd");

// read all
router.get('/', async (req, res, next) => {
	console.log('/	::[GET]');
	try {
		const posts = await Post.findAll();
		posts.forEach((post) => {
			addDate(post);
		});
		return res.render('post/index', {
			posts: posts
		});
	} catch (error) {
		console.error(error);
		next(error);
	}
});

// create
router.get('/create', (req, res) => {
	console.log('/create	:: [GET]');
	res.render('post/create',{
		title : 'post create'
	});
});

router.post('/', async (req, res, next) => {
	console.log('/  :: [POST]');
	try {
		const post = await Post.create({
			title: req.body.title,
			content: req.body.content
		});
		return res.redirect('/posts/' + post.id);
	} catch (error) {
		console.error(error);
		next(error);
	}
});

// read
router.get('/:id', async (req, res, next) => {
	console.log('/:id	::[GET]');
	try {
		const post = await Post.findOne({ where: { id: req.params.id } });
		const comments = await Comment.findAll({ where : {postId : req.params.id }});
		addDate(post);
		comments.forEach((comment) => {
			addDate(comment);
		});
		return res.render('post/read', { post: post , comments : comments});
	} catch (error) {
		console.error(error);
		next(error);
	}
});




// edit page
router.get('/:id/edit', async (req, res, next) => {
	console.log('/:id/edit	::[GET]');
	try {
		const post = await Post.findOne({ where: { id: req.params.id } });
		addDate(post);
		return res.render('post/edit', {
			title : 'post edit',
			post: post,
			_method: 'edit'
		});
	} catch (error) {
		console.error(error);
		next(error);
	}
});

// delete, edit action
router.post('/:id', async (req, res, next) => {
	if (req.body._method == 'delete') {
		console.log('/:id	::[DELETE]');
		try {
			await Post.destroy({ where: { id: req.params.id } });
			res.redirect('/posts');
		} catch (error) {
			console.error(error);
			next(error);
		}
	}else if (req.body._method == 'edit'){
		console.log('/:id	::[update]');
		try{
			console.log('content : ' ,req.body.content);
			await Post.update({title : req.body.title, content : req.body.content},
				{where:{id : req.params.id}, returning:true});
			res.redirect('/posts/'+req.params.id);
		}catch(error){
			console.error(error);
			next(error);
		}
	}
})

// comments
router.post('/:postId/comments', async (req, res, next) => {
	console.log('/:postId/comments	::[post]');
	try{
		await Comment.create({
			content : req.body.content,
			postId : req.params.postId
		});
		res.redirect('/posts/'+req.params.postId);
	}catch(error){
		console.error(error);
		next(error);
	}
});

module.exports = router;