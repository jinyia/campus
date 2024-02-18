const express=require('express')
require("../database/index")
require("../database/modules/user")
require("../database/modules/admin")
require("../database/modules/image")
require("../database/modules/news")
require("../database/modules/review")
require("../database/modules/vedio")
require("../database/modules/newsaudit")
require("../database/modules/newslose")
require("../database/modules/concern")
require("../database/modules/givelikecomment")
require("../database/modules/newslike")
require("../database/modules/newscollect")
require("../database/modules/chat")
const jwt=require("jsonwebtoken")
const main=require("./router/main")
const admin=require("./router/admin")
const bodyParser = require('body-parser')
const User=require("../database/modules/user.js")
const Admin = require('../database/modules/admin')
const fs=require('fs')
const path=require('path')
const app = express()
const port = 3000
app.all('*', (req, res, next) => {
  const { origin, Origin, referer, Referer } = req.headers;
  const allowOrigin = origin || Origin || referer || Referer || '*';
    res.header("Access-Control-Allow-Origin", allowOrigin);
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Credentials", true); //可以带cookies
    res.header("X-Powered-By", 'Express');
    // if (req.method == 'OPTIONS') {
    //   res.sendStatus(200);
    // } else {
    // next();
    // }
    next()
});
app.use('/api',async (req,res,next)=>{ // 路由拦截,验证toktn
    if(req.url=='/login' || req.url=='/register' || req.url=='/admin/login' || req.url=='/admin/register'){
        next()
    }else{
    const token=(req.headers.authorization.split(" ").pop())
    const {userid}=jwt.verify(token,"jinyi")
    if(token=="underfined" || userid==null){
      return  res.send({mag:'无token或者token错误',status:'404'})
    }
    const model=await User.findOne({where:{userid}})
    if(!model){return res.send({mag:'没有此用户'})}
    next()
  }
})
app.use(express.json())
app.use(express.urlencoded({extended:false}));
app.use(express.static('../../public'))
app.use('/api',main)
app.use('/admin',admin)
const options = {

  key:fs.readFileSync(path.join(__dirname,'../cert/key.pem')),
  
  cert:fs.readFileSync(path.join(__dirname,'../cert/cert.pem'))
  
  }

var server=app.listen(port,() => {
  // console.log(`Example app listening on port ${port}`)
  // var host = server.address().address;
  // var port = server.address().port;
  console.log("服务器端口启动",port);
})