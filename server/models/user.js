const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 5; // 몇글자인지 
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
  name : {
    type : String,
    maxlength : 50
  },
  email : {
    type : String,
    trim : true,
    unique : 1
    // trim = 스페이스바 없애줌
  },
  password : {
    type: String,
    maxlength : 70
  },
  lastName : {
    type : String,
    maxlength : 50
  },
  role : {
    // 어떤 유저가 관리자가 될 수 있다. 
    // ex) 1 = 관리자 0 =  일반 유저
    type : Number,
    default : 0
  },
  image : String,
  token : {
    // 유효성 관리
    type : String
  },
  tokenExp : {
    // 토큰 유효기간
    type : Number
  }
})

// 유저 정보를 저장하기 전에... 
userSchema.pre('save',function(next){
  var user = this;
  // 비밀번호를 암호화 시킨다.
  if(user.isModified('password')){
    bcrypt.genSalt(saltRounds, function(err, salt) {
      if(err){
        return next(err)
      }
      bcrypt.hash(user.password, salt, function(err, hash) {
        // Store hash in your password DB.
          //myPlaintextPassword(1번째 인자) = 순수 비번
          //hash == 암호화된 비번
          console.log(hash)
          if(err){
            next(err)
          }
          user.password = hash;
          next();
      });
    });
  }else{
    // 다른내용을 바꾸는 경우
    next();
  }
})

userSchema.methods.comparePassword = function(plainPassword, cb){
 // plainPassword : 암호화되지 않는 비번
 bcrypt.compare(plainPassword, this.password, function(err, isMatch){
  if(err){
    // 같지 않음
    return cb(err)
  }
  cb(null, isMatch)
 })
}

userSchema.methods.generateToken = function(cb){
  var user = this;

  // jsonwebtoken을 이용해서 토큰 생성
  // _id = db Id
  var token = jwt.sign(user._id.toHexString(), 'secretToken');
  // user_id + 'secretToken = token;
  user.token = token;
  user.save(function(err, user){
    if(err){
      return cb(err)
    }
    cb(null, user)
  })
}

userSchema.statics.findByToken = function(token, cb){
  var user = this;
  
  // 토큰을 디코드 한다.
  jwt.verify(token,'secretToken', function(err,decoded){
    // 유저 아이디를 이용해서 유저를 찾은 다음에 
    // 클라이언트에서 가져온 token 과 db token일이 여부 확인
    user.findOne({
      "_id":decoded,
      "token":token
    },function(err,user){
      if(err) {
        return cb(err);
      }
      cb(null,user);
    })
  });
}


const User = mongoose.model('User',userSchema);

// 다른파일에서 사용가능하게 exports
module.exports = {User};