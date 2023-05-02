const express = require("express");
const router = express.Router();

const post = require("../schemas/post.js");
const comment = require("../schemas/comment.js");


//전체 댓글 목록 조회 API
router.get("/post/:postId/comments", async (req,res) => {
    const { postId } = req.params;
    const comments = await comment.find({postId}); //데이터베이스 가져오기
    //console.log(comments[0]["date"])

    const existPost  = await post.find({postId});
    if(existPost.length<1){
        return res.status(400).json({
            success: false,
            errorMessage:"해당 post는 존재하지 않습니다."
            });
    }

    
    const result = comments.map ((comments) => {
        return {
            postId: postId,
            commentCont: comments.commentCont,
            date: comments.date,
            writer: comments.writer
    }
})
    res.json({
        comment : result,
    })
});


//댓글 작성 API
router.post("/post/comments/:commentId", async (req,res) => {
    const {commentId} = req.params;

    //body 정보 담기
    const today = new Date();
    const todayDate = (today.getYear()-100) + "." + (today.getMonth()+1) + "." + today.getDate();
    const {postId, commentCont, writer} = req.body; //객체분해할당
    const date = todayDate;

    const comments = await comment.find({postId}); //데이터베이스 가져오기
    const existPost  = await post.find({postId});


    if(existPost.length<1){
        return res.status(400).json({
            success: false,
            errorMessage:"해당 post는 존재하지 않습니다."
            });
    }



    const existcomment = await comment.find({commentId})
    if(existcomment.length){
        return res.status(400).json({
            success: false,
            errorMessage:"이미 존재하는 commentId입니다."
          });
    }

    if(commentCont.length<1){
        return res.status(400).json({
            success: false,
            errorMessage:"댓글 내용을 입력해주세요."
          });
    }
    
    
    const createdcomment = await comment.create({commentId, postId, commentCont, writer, date});
    
    res.json({comment: createdcomment});;
})

//댓글 수정 AIP
router.put("/post/comments/:commentId", async (req,res) => {
    const { commentId } = req.params;
    const { commentCont} = req.body;

    const existscomment = await comment.find({commentId});
    if(existscomment.length){
        await comment.updateOne(
            {commentId: commentId},
            {$set: {commentCont:commentCont}}
          )
    } else{
        return res.status(400).json({
            success: false,
            errorMessage:"존재하지 않는 댓글ID 입니다."
          });
    }

    res.status(200).json({success:true});

})



//댓글 삭제 AIP
router.delete("/post/comments/:commentId", async (req,res) => {
    const {commentId} = req.params;

    const existscommen = await comment.find({commentId});
    if(existscommen.length){

        await comment.deleteOne({commentId});
        res.json({result:"success"});

    } else{
        return res.status(400).json({
            success: false,
            errorMessage:"존재하지 않는 댓글ID 입니다."
          });
    }

})


module.exports = router; //라우터라는 변수를 밖으로 내보내줌