const express = require("express");
const router = express.Router();

const post = require("../schemas/post.js");


//전체 게시글 목록 조회 API
router.get("/post", async (req,res) => {
    const posts = await post.find({}); //데이터베이스 가져오기
    //const postdate = posts.map((post) => post.date);

    const result = posts.map ((post) => {
        return {
            title: post.title,
            writer: post.writer,
            date: post.date
    }
})
    res.json({
        post : result,
    })
});


//게시글 작성 API
router.post("/post/:postId", async (req, res) => {
    const {postId} = req.params;
    const today = new Date();
    const todayDate = (today.getYear()-100) + "." + (today.getMonth()+1) + "." + today.getDate();
    const {postPW, title, content, writer} = req.body; //객체분해할당
    const date = todayDate;

    const postexist = await post.find({postId}); // 동기적으로 처리해라
    if(postexist.length){
        return res.status(400).json({
          success: false,
          errorMessage:"이미 존재하는 postId입니다."
        });
    }

    const posttitleexist = await post.find({title});
    if(posttitleexist.length){
        return res.status(400).json({
        success: false,
        errorMessage:"이미 존재하는 title입니다."
        });
    }


    const createdpost = await post.create({postId, postPW, title, content, writer, date});

    res.json({post: createdpost});
})


//게시글 조회
router.get("/post/:postId", async (req,res) => {
    const posts = await post.find({}); //데이터베이스 가져오기
    const {postId} = req.params;
    const [detail] = posts.filter((post) => Number(postId) === post.postId)

    res.json({detail})

});

//게시글 수정하기
router.put("/post/:postId", async(req,res) => {
    const { postId } = req.params;
    const { postPW, title, content, writer } = req.body;
  
    const existsPost = await post.find({postId});
    const findpostPW = existsPost.filter((post) => postPW === post.postPW)

    const posttitleexist = await post.find({title});
    if(posttitleexist.length){
        return res.status(400).json({
        success: false,
        errorMessage:"이미 존재하는 title입니다."
        });
    }
    
    if (existsPost.length){
        if (findpostPW.length){
            await post.updateOne(
                {postId: postId},
                {$set: {title:title}},
                {$set: {content:content}},
                {$set: {writer:writer}}
              )
        }else{
            return res.status(400).json({
                success: false,
                errorMessage:"비밀번호를 틀렸습니다."
              });
        }
    }
    res.status(200).json({success:true});
  })

//게시글 삭제하기
router.delete("/post/:postId", async(req,res) => {
    const { postId } = req.params;
    const { postPW } = req.body;
  
    const existspost = await post.find({postId});
    const findpostPW = existspost.filter((post) => postPW === post.postPW)

    if (existspost.length){
        if(findpostPW.length){
            await post.deleteOne({postId});
        }
        else{
            return res.status(400).json({
                success: false,
                errorMessage:"비밀번호를 틀렸습니다."
              });
        }
    }
  
    res.json({result:"success"});
  })

module.exports = router; //라우터라는 변수를 밖으로 내보내줌