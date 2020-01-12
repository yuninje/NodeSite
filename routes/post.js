const express = require('express');
const router = express.Router();
const dateFormat = require('dateformat');
const {isLoggedIn, isNotLoggedIn } = require('./middlewares');

const { User, Post, Comment } = require('../models');

const addDate = (object) => object.date = dateFormat(object.createdAt, "yyyy.mm.dd");

// 게시글 목록 페이지
router.get('/', async (req, res, next) => {
	console.log('/	::[GET]');
	try {
		const posts = await Post.findAll({include : [User]});
		posts.forEach((post) => {
			addDate(post);
		});
		return res.render('post/index', {
            posts: posts,
            user : req.user
		});
	} catch (error) {
		console.error(error);
		next(error);
	}
});

// 게시글 생성 페이지
router.get('/create', isLoggedIn, (req, res) => {
	console.log('/create	:: [GET]');
	res.render('post/create',{
		title : 'post create',
        user : req.user
	});
});

// 게시글 생성 액션
router.post('/',  isLoggedIn, async (req, res, next) => {
	console.log('/  :: [POST]');
	try {
		const post = await Post.create({
			title: req.body.title,
            content: req.body.content, 
            userId : req.user.id
		});
		return res.redirect('/posts/' + post.id);
	} catch (error) {
		console.error(error);
		next(error);
	}
});

// 게시글 디테일 페이지
router.get('/:id', async (req, res, next) => {
	console.log('/:id	::[GET]');
	try {
		const post = await Post.findOne({ where: { id: req.params.id } ,include : [User]});
		const comments = await Comment.findAll({ where : {postId : req.params.id }, include : [User]});
		addDate(post);
		comments.forEach((comment) => {
			addDate(comment);
		});
		return res.render('post/read', { 
            post: post,
            comments : comments,
            user : req.user
        });
	} catch (error) {
		console.error(error);
		next(error);
	}
});




// 게시글 수정 페이지 + req.user.id === post.userId 
router.get('/:id/edit', isLoggedIn, async (req, res, next) => {
	console.log('/:id/edit	::[GET]');
	try {
        const post = await Post.findOne({ where: { id: req.params.id }, include : [User] });
		addDate(post);
		return res.render('post/edit', {
			title : 'post edit',
            user : req.user,
			post: post,
			_method: 'edit'
		});
	} catch (error) {
		console.error(error);
		next(error);
	}
});

// 게시글 수정 및 삭제 액션 + req.user.id === post.userId 
router.post('/:id', isLoggedIn, async (req, res, next) => {
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

// 댓글 생성 액션
router.post('/:postId/comments', isLoggedIn, async (req, res, next) => {
	console.log('/:postId/comments	::[post]');
	try{
		await Comment.create({
			content : req.body.content,
            postId : req.params.postId,
            userId : req.user.id
		});
		res.redirect('/posts/'+req.params.postId);
	}catch(error){
		console.error(error);
		next(error);
	}
});

module.exports = router;