const express = require('express');
const router = express.Router();
const dateFormat = require('dateformat');
const {isLoggedIn, isNotLoggedIn } = require('./middlewares');

const { User, Post, Comment, Hashtag } = require('../models');
const getUserJson = {model : User, attributes:['id','nick']};
const getHashtagJson = {model : Hashtag};

const POST_PER_PAGE = 2;
const PAGE_PER_SCREEN = 3;

const addDate = (object) => object.date = dateFormat(object.createdAt, "yyyy.mm.dd");
const setHashtext = (post) => {
    post.hashtext = ''
    post.hashtags.map(h => post.hashtext += '#'+h.tag+' ');
}
// 게시글 목록 페이지
router.get('/', async (req, res, next) => {
    console.log('/	::[GET]');
    try {
        let nowPage = 1;
        if(req.query.page !== undefined){
            nowPage = req.query.page * 1;
        }
        const totalPostCount = await Post.count();
        
        const startPage = nowPage - (nowPage-1) % PAGE_PER_SCREEN;
        const endPage = startPage + PAGE_PER_SCREEN-1;
        const maxPage = Math.floor((totalPostCount-1)/POST_PER_PAGE)+1;


        const posts = await Post.findAll({
            offset : (nowPage-1) * POST_PER_PAGE,
            limit : POST_PER_PAGE,
            include : [getUserJson, getHashtagJson]
        });
        posts.forEach((post) => {
			addDate(post);
            setHashtext(post);
        });
        
		return res.render('post/index', {
            title : '게시글 목록',
            user : req.user,
            posts : posts,
            startPage : startPage,
            nowPage : nowPage,
            _endPage : endPage,
            maxPage : maxPage,
            PAGE_PER_SCREEN:PAGE_PER_SCREEN
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
		title : '게시글 생성',
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
        
        const hashtags = req.body.hashtext.match(/#[^#\s,;]+/gm);
        // 해쉬태그 테이블에 해쉬태그 추가.
        if(hashtags){
            const result = await Promise.all(hashtags.map(tag => Hashtag.findOrCreate({
				where : { tag : tag.slice(1).toLowerCase()},
            })));
            await post.addHashtags(result.map(r =>r[0]));
        }

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
        const post = await Post.findOne({ where: { id: req.params.id }, include :  [getUserJson, getHashtagJson] });
        post.views += 1
        await Post.update({ views : post.views},{where : {id : req.params.id}}); // 조회수 업데이트
		const comments = await Comment.findAll({
            where : {postId : req.params.id },
            include : getUserJson});

		addDate(post);
        setHashtext(post);

		comments.forEach((comment) => {
			addDate(comment);
        });
		return res.render('post/read', { 
            title : '게시글',
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
        const post = await Post.findOne({ where: { id: req.params.id }, include :  [getUserJson, getHashtagJson]});
        addDate(post);
        setHashtext(post);
		return res.render('post/edit', {
			title : '게시글 수정',
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
    const postId = req.params.id;
    const userId = req.body.userId;
    const title = req.body.title;
    const content = req.body.content;
    const hashtext = req.body.hashtext;
	if (req.body._method == 'delete') {
		console.log('/:id	::[DELETE]');
		try {
			await Post.destroy({ where: { id: postId } });
            if(userId){
                res.redirect('/users/posts');
            }
            res.redirect('/posts');
		} catch (error) {
			console.error(error);
			next(error);
        }
        
	}else if (req.body._method == 'edit'){
		console.log('/:id	::[update]');
		try{
			await Post.update({title : title, content : content},
                {where:{id : postId}, returning:true});
            const post = await Post.findOne({where : {id:postId}, include : getHashtagJson});
            const hashtags = hashtext.match(/#([0-9a-zA-Z가-힣]*)/gm);
            // 해쉬태그 테이블에 해쉬태그 추가.

            post.removeHashtags(post.hashtags.map(h => h.id));
            if(hashtags){
                const result = await Promise.all(hashtags.map(tag => Hashtag.findOrCreate({
                    where : { tag : tag.slice(1).toLowerCase()},
                })));
                await post.addHashtags(result.map(r =>r[0]));
            }

			res.redirect('/posts/'+postId);
		}catch(error){
			console.error(error);
			next(error);
		}
	}
});

router.post('/:id/like', isLoggedIn , async (req, res, next) => {
	const postId = req.params.id;
	try{
		await req.user.addLike(postId);
		res.send('success');
	}catch(error){
		console.error(error);
		next(error);
	}
});

router.post('/:id/unlike', isLoggedIn , async (req, res, next) => {
	const postId = req.params.id;
	try{
		await req.user.removeLike(postId);
		res.send('success');
	}catch(error){
		console.error(error);
		next(error);
	}
});


module.exports = router;