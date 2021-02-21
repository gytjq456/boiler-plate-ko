const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const config = require('./config/key');
const {auth} = require('./middleware/auth');
const {User} = require("./models/User");

// application/x-www-form-urlencoded 파일을 분석해서 가져오는
app.use(bodyParser.urlencoded({extended:true}));

// application/json 파일을 분석해서 가져오는
app.use(bodyParser.json());
app.use(cookieParser());


const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {
  useNewUrlParser:true,  useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('mongoDb Connected....'))
  .catch(err => console.log(err))



app.get('/', (req, res) => {
  res.send('Hello World! testsetasdasd nasd123')
})

app.post('/api/users/register',(req, res) => {
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

app.post('/api/users/login',(req,res) => {
  // 데이터베이스에서 존재여부 찾기 
  User.findOne({email : req.body.email}, (err, user) => {
    if(!user){
      return res.json({
        loginSucess : false,
        message : "제공된 이메일에 해당하는 유저가 없습니다."
      })
    }

    // 비밀번호 일치 여부
    user.comparePassword(req.body.password, (err, isMatch) =>{
      console.log(isMatch)
      if(!isMatch){
        // 같지않음
        return res.json({
          loginSucess : false,
          message : "비밀번호가 틀렸습니다."
        })
      }
      // 비밀번호 까지 맞다면 토큰을 생성하기
      user.generateToken((err, user) =>{
        if(err) {
          return res.status(400).send(err);
        }
        
        // 토큰을 저장한다. 어디에?? 쿠키? 로컬스토리지
        res.cookie("x_auth", user.token).status(200).json({
          loginSucess : true,
          userId : user._id
        })
      })      
    })
  })
})

// auth route 
app.get('/api/users/auth',auth,(req,res) => {
  // 여기까지 미들웨어를 통화 했다는 얘기는 auuthentication 이 true라는말
  res.status(200).json({
    _id: req.user._id,
    isAdmin : req.user.role === 0 ? false : true,
    isAuth : true,
    email : req.user.email,
    name : req.user.name,
    lastname : req.user.lastname,
    role : req.user.role,
    image : req.user.image
  })
})

// logout route
app.get('/api/users/logout',auth,(req,res) =>{
  User.findOneAndUpdate({_id:req.user._id},{token :""},(err,user) =>{
      if(err) {
        return res.json({success: false,err})
      }
      return res.status(200).json({
        success: true
      })
    })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

