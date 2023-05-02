const express = require('express');
const app = express();
const port = 3000;
//라우터
const commentsRouter = require('./routes/comments.js');
const postsRouter = require('./routes/posts.js');
//const indexRouter = require('./routes/index.js');

//몽고디비 사용
const connect = require("./schemas")
connect();



app.use(express.json()); // 바디를 사용하기위한 전역미들웨어
//라우터실행
app.use("/api", [commentsRouter, postsRouter]);


app.get("/", (req,res) => {
    res.send('Hello World!');
    }) //기본 locahost test용
  
  
  app.listen(port, () => {
    console.log(port, '포트로 서버가 열렸어요!');
  });