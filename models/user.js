const mongoose = require('mongoose');
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

const User = mongoose.model('User',userSchema);

// 다른파일에서 사용가능하게 exports
module.exports = {User};