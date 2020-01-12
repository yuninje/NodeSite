const express = require('express');
const router = express.Router();
const dateFormat = require('dateformat');
const {isLoggedIn, isNotLoggedIn } = require('./middlewares');

const {User, Post, Comment} = require('../models');
const addDate = (object) => object.date = dateFormat(object.createdAt, "yyyy.mm.dd");

router.get('/', isLoggedIn,  async (req, res, next) => {
    try{
        const postCount = await Post.findAndCountAll({where : {userId : req.user.id}});
        const commentCount = await Comment.findAndCountAll({where : {userId : req.user.id}});
        return res.render('user/profile', {
            title : '사용자 프로필',
            user : req.user,
            postCount : postCount,
            commentCount : commentCount
        });
    }catch(error){
        console.error(error);
        next(error);
    }
});

router.get('/posts', isLoggedIn, async (req, res, next) => {
    try{
        const posts = await Post.findAll({
            where : { userId : req.user.id },
        });
        posts.forEach((post) => {
            addDate(post);
        });

        return res.render('user/posts', {
            title : '내 게시글',
            user : req.user,
            posts : posts
        });
    }catch(error){
        console.error(error);
        next(error);
    }
})

router.get('/comments', isLoggedIn, async (req, res, next) => {
    try{
        const comments = await Comment.findAll({
            where : { userId : req.user.id },
        });
        comments.forEach((comment) => {
            addDate(comment);
        });

        return res.render('user/comments', {
            title : '내 댓글',
            user : req.user,
            comments : comments
        });
    }catch(error){
        console.error(error);
        next(error);
    }
})


module.exports = router;