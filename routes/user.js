const express = require('express');
const router = express.Router();
const dateFormat = require('dateformat');
const {isLoggedIn, isNotLoggedIn } = require('./middlewares');

const {User, Post, Comment, Hashtag } = require('../models');
const getUserJson = {model : User, attributes:['id','nick']};
const getHashtagJson = {model : Hashtag};

const addDate = (object) => object.date = dateFormat(object.createdAt, "yyyy.mm.dd");
const setHashtext = (post) => {
    post.hashtext = ''
    post.hashtags.map(h => post.hashtext += '#'+h.tag+' ');
}

const POST_PER_PAGE = 2;
const PAGE_PER_SCREEN = 3;

router.get('/:nick', isLoggedIn,  async (req, res, next) => {
    try{
        const difUser = await User.findOne({
            where : {nick : req.params.nick},
            include : [{
                model : User,
                attributes : ['id', 'nick'],
                as : 'Followers',
            },{
                model : User,
                attributes : ['id', 'nick'],
                as : 'Followings',
            }]});
        console.log(difUser.id);
        const postCount = await Post.findAndCountAll({where : {userId : difUser.id}});
        const commentCount = await Comment.findAndCountAll({where : {userId : difUser.id}});
        console.log(difUser);
        return res.render('user/profile', {
            title : difUser.nick + '님의 프로필',
            user : req.user,
            difUser : difUser,
            postCount : postCount,
            commentCount : commentCount
        });
    }catch(error){
        console.error(error);
        next(error);
    }
});

router.get('/:nick/posts', isLoggedIn, async (req, res, next) => {
    try{
        let nowPage = 1;
        if(req.query.page !== undefined){
            nowPage = req.query.page * 1;
        }
        const difUser = await User.findOne({where : {nick : req.params.nick}});
        const totalPostCount = await Post.count({
            where : { userId : difUser.id },
        });
        const startPage = nowPage - (nowPage-1) % PAGE_PER_SCREEN;
        const endPage = startPage + PAGE_PER_SCREEN-1;
        const maxPage = Math.floor((totalPostCount-1)/POST_PER_PAGE)+1;
        
        const posts = await Post.findAll({
            offset : (nowPage-1) * POST_PER_PAGE,
            limit : POST_PER_PAGE,
            where : { userId : difUser.id },
            include : [getUserJson, getHashtagJson]
        });
        posts.forEach((post) => {
            addDate(post);
            setHashtext(post);
        });

        return res.render('user/posts', {
            title : difUser.nick + '님의 게시글',
            user : req.user,
            difUser : difUser,
            posts : posts,
            startPage : startPage,
            nowPage : nowPage,
            _endPage : endPage,
            maxPage : maxPage,
            PAGE_PER_SCREEN:PAGE_PER_SCREEN
        });
    }catch(error){
        console.error(error);
        next(error);
    }
})

router.get('/:nick/comments', isLoggedIn, async (req, res, next) => {
    try{
        let nowPage = 1;
        if(req.query.page !== undefined){
            nowPage = req.query.page * 1;
        }
        const difUser = await User.findOne({where : {nick : req.params.nick}});
        const totalCommentCount = await Comment.count({
            where : { userId : difUser.id },
        });
        const startPage = nowPage - (nowPage-1) % PAGE_PER_SCREEN;
        const endPage = startPage + PAGE_PER_SCREEN-1;
        const maxPage = Math.floor((totalCommentCount-1)/POST_PER_PAGE)+1;
        
        const comments = await Comment.findAll({
            offset : (nowPage-1) * POST_PER_PAGE,
            limit : POST_PER_PAGE,
            where : { userId : difUser.id },
        });
        comments.forEach((comment) => {
            addDate(comment);
        });

        return res.render('user/comments', {
            title : difUser.nick + '님의 댓글',
            user : req.user,
            difUser : difUser,
            comments : comments,
            startPage : startPage,
            nowPage : nowPage,
            _endPage : endPage,
            maxPage : maxPage,
            PAGE_PER_SCREEN:PAGE_PER_SCREEN
        });
    }catch(error){
        console.error(error);
        next(error);
    }
});

router.post('/:id/follow', isLoggedIn, async (req, res, next) => {
    try{
        await req.user.addFollowing(parseInt(req.params.id, 10));   // 이미 들어가 있을 때 실행되어도 또 추가되지 않음.
        res.send('success');
    }catch(error){
        console.error(error);
        next(error);
    }
});

router.post('/:id/unfollow', isLoggedIn, async (req, res, next) => {
    try{
        await req.user.removeFollowing(parseInt(req.params.id, 10));
        res.send('success');
    }catch(error){
        console.error(error);
        next(error);
    }
});


module.exports = router;