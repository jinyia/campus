const express=require('express')
const User=require('../../database/modules/user')
const main=express.Router()
let bcrypt = require('bcryptjs');
const jwt=require("jsonwebtoken")
const News = require('../../database/modules/news')
const Cencern=require("../../database/modules/concern")
const Reviews=require("../../database/modules/review")
const Givelike=require("../../database/modules/givelikecomment")
const Newslike=require("../../database/modules/newslike")
const NewsCollect=require("../../database/modules/newscollect")
const { sequelize } = require('../../database/index')
const Newsaudit=require("../../database/modules/newsaudit")
const Chat=require("../../database/modules/chat")
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
//注册
main.post('/register', async (req,res)=>{
    let {username,avatarimage,password,sex,phone,eamil}=req.body
    let model2=await User.max('userid')//返回最大id
    let userid=0;
    if(model2){userid=model2+1}//最大id加1作为新用户的id}
    else{userid=1}//最大id加1作为新用户的id
    //密码加密
    password=bcrypt.hashSync(password,10)
    const usersuccess=await User.create({userid,username,avatarimage,password,sex,phone,eamil})
    res.send(usersuccess)
})
//登录
main.post('/login',async(req,res)=>{
    const {userid,password}=req.body
    console.log("登录")
    const model=await User.findOne({where:{userid}})
    if(!model){return res.send({msg:'用户不存在'})}
    if(bcrypt.compareSync(password,model.dataValues.password)){//password==model.dataValues.password
        const token=jwt.sign({userid},"jinyi")
        res.send({token,model})
    }else if(password==model.dataValues.password){
        const token=jwt.sign({userid},"jinyi")
        res.send({token,model})
    }
    else{
        return res.send({msg:'密码错误'})
    }
})
//获去这个分类的所有新闻
main.post('/categorynews',async(req,res)=>{
    const {category}=req.body
    if(category=='全部'){
        const model=await News.findAll({order:[['readership','DESC']]})//排序，按阅读量
        if(model){return res.send({model})}
        else{return req.send({Error})}
    }
    else{
    const model=await News.findAll({where:{category:`${category}`}})
    if(model){return res.send({model})}
    else{return res.send({Error})}
    }
})
main.post('/createdAtcategorynews',async(req,res)=>{
    const {category}=req.body
    if(category=='全部'){
        const model=await News.findAll({order:[['createdAt','DESC']]})//排序，按最新
        if(model){return res.send({model})}
        else{return req.send({Error})}
    }
    else{
    const model=await News.findAll({where:{category:`${category}`}})
    if(model){return res.send({model})}
    else{return res.send({Error})}
    }
})
//给新闻阅读量加1
main.post("/newsaddreadership",async(req,res)=>{
    const {newsid}=req.body
    const model1=await News.findOne({where:{newsid}})
    let g1=model1.dataValues.readership
    g1=g1+1
    const model=await News.update({readership:`${g1}`},{where:{newsid}})
    if(model){return res.send({model})}
    else{return res.send({Error})}
})
//获取新闻详细信息
main.post('/newsdetail',async(req,res)=>{
    const {newsid}=req.body
    const model=await News.findOne({where:{newsid}})
    if(model){return res.send({model})}
})
//获取新闻评论
main.post('/commentsum',async(req,res)=>{
    const {newsid}=req.body;
    const model=await Reviews.findAll({where:{newsid,parentid:'0'}})
    if(model){return res.send({model})}
})
main.post('/commentsumall',async(req,res)=>{
    const {newsid}=req.body;
    const model=await Reviews.findAll({where:{newsid}})
    if(model){return res.send({model})}
})
//返回所属父评论的子评论
main.post('/childrenreview',async(req,res)=>{
    const {reviewid}=req.body
    const model=await Reviews.findAll({where:{parentid:`${reviewid}`}})
    if(model){res.send({model})}
})
//新建新闻
main.post('/usercreatenews',async(req,res)=>{
    const {authorid,author,title,titlecover,category,context,vedio}=req.body
    const model1=await News.max('newsid')
    let id=0
    id=model1+1
    const model2=await Newsaudit.max('newsid')
    if(model2>=id){
        id=model2+1
    }
    const model=await Newsaudit.create({newsid:`${id}`,authorid,author,title,titlecover,category,context,vedio,status:false})
    if(model){
        return res.send({model})
    }
})
//获取账号信息信息
main.post('/userinfo',async(req,res)=>{
    const {userid}=req.body
    const model=await User.findOne({where:{userid}})
    if(model){return res.send({model})}
})
//获取用户点赞数
main.post('/getgivelike',async(req,res)=>{
    const {authorid}=req.body
    console.log(authorid)
    const model=await News.findAll({where:{authorid:`${authorid}`}})
    if(model){return res.send({model})}
})

//用户关注事件
main.post('/userconcern',async(req,res)=>{
    const {userid,authorid}=req.body
    const model1=await Cencern.findOne({where:{userid:`${userid}`,authorid:`${authorid}`}})
    if(model1){return res.send({msg:'已经关注'})}
    const model3=await User.findOne({attributes:['fans'],where:{userid:`${authorid}`}})
    let fan=model3.dataValues.fans
    fan=fan+1
    const model4=await User.update({fans:`${fan}`},{where:{userid:`${authorid}`}})
    const model6=await User.findOne({attributes:['follow'],where:{userid:`${userid}`}})
    let follows=model6.dataValues.follow
    follows=follows+1
    const model7=await User.update({follow:`${follows}`},{where:{userid:`${userid}`}})
    let id=await Cencern.max('concernid')
    id=id+1
    const model=await Cencern.create({concernid:`${id}`,userid,authorid})
    if(model){return res.send({msg:'关注成功'})}
})
//删除用户关注事件
main.post('/deuserconcern',async(req,res)=>{
    const {userid,authorid}=req.body
    const model=await Cencern.destroy({where:{userid:`${userid}`,authorid:`${authorid}`}})
    const model3=await User.findOne({attributes:['fans'],where:{userid:`${authorid}`}})
    let fan=model3.dataValues.fans
    fan=fan-1
    const model4=await User.update({fans:`${fan}`},{where:{userid:`${authorid}`}})
    const model6=await User.findOne({attributes:['follow'],where:{userid:`${userid}`}})
    let follows=model6.dataValues.follow
    follows=follows-1
    const model7=await User.update({follow:`${follows}`},{where:{userid:`${userid}`}})
    if(model){return res.send({msg:'删除成功'})}
    else{return res.send({msg:'删除失败'})}
})
//查询有无关注
main.post('/findcencern',async(req,res)=>{
    const {userid,authorid}=req.body
    const model=await Cencern.findAll({where:{userid:`${userid}`,authorid:`${authorid}`}})
    if(model.length!=0){return res.send({msg:'1'})}
    else{return res.send({msg:'0'})}
})
//查询用户是否点赞过这条评论
main.post("/findgivelike",async(req,res)=>{
    const {userid,reviewid}=req.body;
    const model=await Givelike.findAll({where:{userid,reviewid}})
    if(model){return res.send({model})}
})
//用户点赞评论
main.post('/reviewgivelike',async(req,res)=>{
    const {userid,reviewid}=req.body;
    const model1=await Givelike.findOne({where:{userid,reviewid}})
    if(model1){return res.send({msg:'已经存在'})}
    const model2=await Reviews.findOne({where:{reviewid}})
    let like=model2.dataValues.relike+1
    const model3=await Reviews.update({relike:like},{where:{reviewid}})
    let s=await Givelike.max('reviewlikeid')
    s=s+1
    const model=await Givelike.create({reviewlikeid:`${s}`,userid,reviewid});
    if(model){return res.send({model})}
})
//用户取消点赞评论
main.post('/unreviewgivelike',async(req,res)=>{
    const {userid,reviewid}=req.body;
    const model2=await Reviews.findOne({where:{reviewid}})
    let like=model2.dataValues.relike-1
    const model3=await Reviews.update({relike:like},{where:{reviewid}})
    const model=await Givelike.destroy({where:{userid,reviewid}});
    if(model){return res.send({model})}
})
//用户发布评论
main.post('/createreivew',async(req,res)=>{
    const {newsid,authorid,context}=req.body
    const model1=await Reviews.max('reviewid')
    let newreviewid=model1+1
    const model=await Reviews.create({reviewid:`${newreviewid}`,newsid,authorid,context})
    if(model){return res.send({model})}
})
//用户发布子评论
main.post('/createsecondreivew',async(req,res)=>{
    const {newsid,authorid,context,parentid}=req.body
    const model1=await Reviews.max('reviewid')
    let newreviewid=model1+1
    const model=await Reviews.create({reviewid:`${newreviewid}`,newsid,authorid,context,parentid})
    if(model){return res.send({model})}
})
//删除用户评论
main.post('/dereview',async(req,res)=>{
    const {reviewid}=req.body;
    const model=await Reviews.destroy({where:{reviewid}})
    if(model){return res.send({msg:'删除成功'})}
})
//查询用户是否点赞这条新闻
main.post("/findnewslike",async(req,res)=>{
    const {userid,newsid}=req.body
    const model=await Newslike.findOne({where:{userid,newsid}})
    if(model){return res.send({msg:'1'})}
    else{return res.send({msg:'0'})}
})
//用户添加新闻喜欢
main.post("/newslike",async(req,res)=>{
    const {userid,newsid}=req.body
    let s=await Newslike.max('newslikeid')
    s=s+1
    const model=await Newslike.create({newslikeid:`${s}`,userid,newsid})
    const model2=await News.findOne({attributes: ['givelike'],where:{newsid}})
    let give=model2.dataValues.givelike
    give=give+1
    const model3=await News.update({givelike:`${give}`},{where:{newsid}})
    if(model){return res.send({model})}
    
})
//用户取消新闻喜欢
main.post("/denewslike",async(req,res)=>{
    const {userid,newsid}=req.body
    const model=await Newslike.destroy({where:{userid,newsid}})
    const model2=await News.findOne({attributes: ['givelike'],where:{newsid}})
    let give=model2.dataValues.givelike
    give=give-1
    const model3=await News.update({givelike:`${give}`},{where:{newsid}})
    if(model){return res.send({msg:"取消点赞成功"})}
})
//查询用户是否收藏这条新闻
main.post("/findnewscollect",async(req,res)=>{
    const {userid,newsid}=req.body
    const model=await NewsCollect.findOne({where:{userid,newsid}})
    if(model){return res.send({msg:'1'})}
    else{return res.send({msg:'0'})}
})
//用户添加新闻收藏
main.post("/newscollect",async(req,res)=>{
    const {userid,newsid}=req.body
    let s=await NewsCollect.max('collectsid')
    s=s+1
    const model=await NewsCollect.create({collectsid:`${s}`,userid,newsid})
    let model2=await News.findOne({where:{newsid}})
    let x=model2.dataValues.collet
    x=x+1
    const mdoel3=await News.update({collet:`${x}`},{where:{newsid}})
    if(model){return res.send({model})}
})
//用户取消新闻收藏
main.post("/denewscollect",async(req,res)=>{
    const {userid,newsid}=req.body
    const model=await NewsCollect.destroy({where:{userid,newsid}})
    let model2=await News.findOne({where:{newsid}})
    let x=model2.dataValues.collet
    x=x-1
    const mdoel3=await News.update({collet:`${x}`},{where:{newsid}})
    if(model){return res.send({msg:"取消收藏成功"})}
})
//搜索相关新闻,从title查找
main.get("/searchresult",async(req,res)=>{
    const {searchValue}=req.query
    console.log(searchValue)
    const model=await News.findAll({where:{title:{[Op.like]:`%${searchValue}%`}}})
    if(model){return res.send({model})}
    else{return res.send(Error)}
})
//搜索所有粉丝
main.post('/allfans',async(req,res)=>{
    let {authorid}=req.body
    const model=await Cencern.findAll({where:{authorid}})
    res.send({model})
})
//移除粉丝
main.post('/defans',async(req,res)=>{
    let {userid,authorid}=req.body
    const model=await Cencern.destroy({where:{userid:`${userid}`,authorid:`${authorid}`}})
    const model2=await User.findOne({where:{userid:`${authorid}`}})
    let fan=model2.dataValues.fans
    console.log(fan)
    fan=fan-1
    const model4=await User.update({fans:`${fan}`},{where:{userid:`${authorid}`}})
    if(model){res.send({msg:'删除成功'})}
})
//获取所有关注
main.post('/allfollow',async(req,res)=>{
    let {userid}=req.body
    const model=await Cencern.findAll({where:{userid}})
    if(model){res.send({model})}
})
//移除关注
main.post('/defollow',async(req,res)=>{
    let {userid,authorid}=req.body
    const model=await Cencern.destroy({where:{userid:`${userid}`,authorid:`${authorid}`}})
    const model2=await User.findOne({where:{userid:`${userid}`}})
    let follows=model2.dataValues.follow
    follows=follows-1
    const model3=await User.update({follow:`${follows}`},{where:{userid:`${userid}`}})
    if(model){res.send({msg:'删除成功'})}
})
//获取用户作品
main.post('/getuserwork',async(req,res)=>{
    let {userid}=req.body
    const model=await News.findAll({where:{authorid:`${userid}`}})
    if(model){res.send({model})}
})
//用户喜欢的新闻id
main.post('/getsuserlike',async(req,res)=>{
    let {userid}=req.body
    const model=await Newslike.findAll({where:{userid:`${userid}`}})
    if(model){res.send({model})}
})
//用户收藏的新闻id
main.post('/getsusercollectnews',async(req,res)=>{
    let {userid}=req.body
    const model=await NewsCollect.findAll({where:{userid:`${userid}`}})
    if(model){res.send({model})}
})
//修改用户名
main.post('/updateusername',async(req,res)=>{
    const {userid,username}=req.body
    const model=await User.update({username:`${username}`},{where:{userid}})
    if(model){res.send({msg:'修改成功'})}
})
//获取用户所有评论
main.post('/allreviews',async(req,res)=>{
    const {authorid}=req.body
    const model=await Reviews.findAll({where:{authorid}})
    if(model){res.send({model})}
})
//获取信息记录
main.post('/sendiddata',async(req,res)=>{
    const {sendid,receiveid}=req.body
    const model=await Chat.findAll({where:{sendid,receiveid}})
    if(model){res.send({model})}
})
//添加信息
main.post('/addxinxi',async(req,res)=>{
    const {sendid,receiveid,context,createdAt}=req.body
    let s=await Chat.max('chatid')
    s=s+1
    console.log(createdAt)
    const model=await Chat.create({chatid:`${s}`,sendid,receiveid,context,createdAt})
    if(model){res.send({model})}
})
//添加信息图像
main.post('/addxinxitx',async(req,res)=>{
    const {sendid,receiveid,avatarimage,createdAt}=req.body
    let s=await Chat.max('chatid')
    s=s+1
    console.log(createdAt)
    const model=await Chat.create({chatid:`${s}`,sendid,receiveid,avatarimage,createdAt})
    if(model){res.send({model})}
})
//查询是否有新的信息
main.post('/chatsifnew',async(req,res)=>{
    const {sendid,receiveid,count}=req.body
    const model=await Chat.count({where:{sendid:`${sendid}`,receiveid:`${receiveid}`}})
    const model2=await Chat.count({where:{sendid:`${receiveid}`,receiveid:`${sendid}`}})
    let count1=model+model2
    if(count==count1){return res.send({msg:'没有变化'})}
    else{
        const model4=await Chat.findAll({where:{sendid:`${sendid}`,receiveid:`${receiveid}`}})
        const model5=await Chat.findAll({where:{sendid:`${receiveid}`,receiveid:`${sendid}`}})
        res.send({model4,model5})
    }
})
//返回聊天列表
main.post('/chatperson',async(req,res)=>{
    const {sendid}=req.body
    const model1=await Chat.findAll({where:{sendid},order:[['createdAt','DESC']],include:{model:User,as:'Chats'}})
    if(model1){res.send({model1})}
})
module.exports=main
