const { User } = require("../models/User");

let auth = (req,res,next) => {
  // 인증처리 하는 곳

  // 1. 클라이언트 쿠키에서 토근을 가져오기
  let token = req.cookies.x_auth;

  // 2. 토큰을 복호화 한다음 db에서 찾는다
  User.findByToken(token, (err,user) =>{
    if(err){
      return err;
    }
    if(!user){
      return res.json({
        isAuth : false,
        error : true
      })
    }
    req.token = token;
    req.user = user;
    next();
  })

  // 3. 유저가 있으면 인증 OK 없어면 No

  

}

module.exports = {auth};