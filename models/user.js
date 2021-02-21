const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10; // 몇글자인지 

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
    maxlength : 50
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
          console.log(salt)
          if(err){
            next(err)
          }
          user.password = hash;
          next();
      });
    });
  }
})

const User = mongoose.model('User',userSchema);

// 다른파일에서 사용가능하게 exports
module.exports = {User};