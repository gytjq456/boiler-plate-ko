const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser');
const config = require('./config/key');
const {User} = require("./models/User");

// application/x-www-form-urlencoded 파일을 분석해서 가져오는
app.use(bodyParser.urlencoded({extended:true}));

// application/json 파일을 분석해서 가져오는
app.use(bodyParser.json());


const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {
  useNewUrlParser:true,  useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('mongoDb Connected....'))
  .catch(err => console.log(err))



app.get('/', (req, res) => {
  res.send('Hello World! testsetasdasd nasd123')
})

app.post('/register',(req, res) => {
  // 회원가입 할때 필요한 정보들을 client에서 가져오면
  // 그것들을 데이터베이스에 넣어준다.

  //req.body = json형식으로 담겨있다.
  
  const user = new User(req.body);

  //비밀번호 암호화 

  // 몽고디비 메서드 save
  user.save((err, userInfo)=>{
    if(err){
      return res.json({success: false,err})
    }else{
      return res.status(200).json({
        success:true
      })
    }
  })
})


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

