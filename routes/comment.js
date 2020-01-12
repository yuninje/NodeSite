const express = require('express');
const router = express.Router();
const {isLoggedIn, isNotLoggedIn } = require('./middlewares');

const { User, Post, Comment } = require('../models');

router.post('/:commentId', async (req, res, next) =>{
    console.log('/comments/:commentId  :: [POST] ');
    if(req.body._method === 'delete'){
        console.log('/comments/:commentId   ::[DELETE]');
        const postId = req.body.postId; // 게시글에서 댓글 삭제
        const userId = req.body.userId; // 자신의 댓글 관리 시스템에서 댓글 삭제
        const commentId = req.params.commentId;
        try{
            await Comment.destroy({where: {id : commentId}});
            if (postId){
                res.redirect('/posts/'+postId);
            }else if(userId){
                res.redirect('/users/'+userId+'/comments');
            }
        }catch(error){
            console.error(error);
            next(error);
        }
    }else if ( req.body._method === 'edit'){
        console.log('/comments/:commentId   ::[PUT]');
        try{
            await Comment.update({
                content : req.body.content
            }, {
                where : {id : commentId},
                returning : true
            });

            res.redirect('/posts/'+postId);
        }catch(error){
            console.error(error);
            next(error);
        }
    }
}); 


module.exports = router;