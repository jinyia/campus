const express=require('express')
const Admin=require('../../database/modules/admin')
const admin=express.Router()
const User=require('../../database/modules/user')
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")
const multer = require('multer')
const path=require('path')
const Images=require('../../database/modules/image')
const Sequelize = require('sequelize');
const News = require('../../database/modules/news')
const Review=require("../../database/modules/review")
const Vedio=require("../../database/modules/vedio")
const Newsaudit=require("../../database/modules/newsaudit")
const Newslose=require("../../database/modules/newslose")
const Newscollect=require("../../database/modules/newscollect")
const Concern=require("../../database/modules/concern")
const Newslike=require("../../database/modules/newslike")
const Reviewlike=require("../../database/modules/givelikecomment")
const Chat=require("../../database/modules/chat")
const Op = Sequelize.Op;
const storage = multer.diskStorage({//图片
    destination: function (req, file, cb) {
        //控制文件的存储路径
         
        cb(null,path.join(__dirname,"../../public"))
    },
    filename: function (req, file, cb) {
        //定义上传文件储时的文件名
        let times=Date.now()
        let dir=times+file.originalname
        cb(null, dir)
    }
})
const upload = multer({ storage: storage })
//注册
admin.post('/register',async(req,res)=>{
    const {adminname,password}=req.body
    const model=await Admin.findOne({where:{adminname}})
    if(model){return res.send({mag:'用户已经存在'})}
    const successmodel=await Admin.create({adminname,password})
    res.send({successmodel})
})
//登录
admin.post('/login',async(req,res)=>{
    const {adminname,password}=req.body
    const model=await Admin.findOne({where:{adminname}})
    if(!model){return res.send({msg:'用户不存在'})}
    if(password!=model.dataValues.password){return res.send({msg:'密码错误'})}
    else{
        const token=jwt.sign(adminname,"jinyi")
        res.send({adminname,token})
    }

})
//测试
admin.post('/test',async (req,res)=>{
    const model=await User.max('userid')
    console.log(model)
    if(model){return res.send({model})}
})
//删除用户数据行
admin.post('/deuser',async(req,res)=>{
    const {userid}=req.body;
    let model=await User.destroy({where:{userid}})
    if(model){return res.send({msg:'删除成功'})}
    else{return res.send({msg:'没有符合id的数据可供删除'})}
})
//页面初始化获取用户数据
admin.get('/seuser',async(req,res)=>{
    const model=await User.findAll()
    if(!model){return res.send("数据库没有数据")}
    res.send({model})
})
//获取用户表男女数量
admin.get('/sexs',async(req,res)=>{
    const model=await User.count({where:{sex:'男'}})
    const model2=await User.count({where:{sex:'女'}})
    if(!model){return res.send("数据库没有数据")}
    res.send({man:`${model}`,waman:`${model2}`})
})
//获取粉丝数量前五
admin.get('/fanss',async(req,res)=>{
    let model=await User.findAll({
        attributes: ['username','fans'],
        order:[['fans','DESC']]
    })
    let fans=[]
    for(let i=0;i<5;i++){
        fans.push(model[i].dataValues)
    }
    res.send({fans})
})
//新建用户数据
admin.post('/cruser',async(req,res)=>{
    let {username,avatarimage,password,phone,sex,eamil,follow,fans,selfas}=req.body;
    let s=await User.max('userid')
    s=s+1 
    password=bcrypt.hashSync(password,10)
    const model=await User.create({userid:`${s}`,username:`${username}`,avatarimage:`${avatarimage}`,password:`${password}`,phone:`${phone}`,sex:`${sex}`,eamil:`${eamil}`,follow:`${follow}`,fans:`${fans}`,selfas:`${selfas}`})
    if(model){return res.send({msg:'创建成功'})}
})
//修改用户数据
admin.post('/upuser',async(req,res)=>{
    let {userid,username,avatarimage,password,phone,sex,eamil,follow,fans,selfas,updatedAt}=req.body;
    let model;
    console.log(password.length)
    if(password.length>=60){
         model=await User.update({username,avatarimage,phone,sex,eamil,follow,fans,selfas,updatedAt:`${updatedAt}`},{where:{userid:`${userid}`}})
    }else{
        password=bcrypt.hashSync(password,10)
        model=await User.update({username,avatarimage,password,phone,sex,eamil,follow,fans,updatedAt:`${updatedAt}`},{where:{userid:`${userid}`}})
    }
    if(model){return res.send({mag:'修改成功'})}
    else{res.send({msg:'修改失败'})}
})
//用户修改密码
admin.post('/uppasswprd',async(req,res)=>{
    let {userid,password}=req.body
    password=bcrypt.hashSync(password,10)
    let model=await User.update({password},{where:{userid:`${userid}`}})
    if(model){return res.send({model})}
})
//获取账号信息信息
admin.post('/userinfo',async(req,res)=>{
    const {userid}=req.body
    const model=await User.findOne({where:{userid}})
    if(model){return res.send({model})}
})
//搜索框搜索用户数据
admin.post('/searuser',async(req,res)=>{
    const {userid,username,phone}=req.body
    if(userid!=0){
        const model=await User.findAll({where:{userid:{[Op.like]:`%${userid}%`}}})
        if(model){res.send({model})}
    }else if(username!=''){
        const model=await User.findAll({where:{username:{[Op.like]:`%${username}%`}}})
        if(model){res.send({model})}
    }else{
        const model=await User.findAll({where:{phone:{[Op.like]:`%${phone}%`}}})
        if(model){res.send({model})}
    }
})
//搜索关注
admin.post('/seareviewlike',async(req,res)=>{
    const {reviewlikeid,userid,reviewid}=req.body
    if(reviewlikeid!=0){
        const model=await Reviewlike.findAll({where:{reviewlikeid:{[Op.like]:`%${reviewlikeid}%`}}})
        if(model){res.send({model})}
    }else if(userid!=0){
        const model=await Reviewlike.findAll({where:{userid:{[Op.like]:`%${userid}%`}}})
        if(model){res.send({model})}
    }else{
        const model=await Reviewlike.findAll({where:{reviewid:{[Op.like]:`%${reviewid}%`}}})
        if(model){res.send({model})}
    }
})
//图片上传返回
admin.post('/image',upload.single('file'),async(req,res)=>{
    console.log(req.file)
    let Image=("http://localhost:5173/public/"+`${req.file.filename}`)

    const model=await Images.create({Image})
    if(model){return res.send({Image})}
})
//视频上传返回
admin.post('/vedio',upload.single('file'),async(req,res)=>{
    console.log(req.file)
    let vedio=("http://localhost:5173/public/"+`${req.file.filename}`)
    const model=await Vedio.create({vedio})
    if(model){return res.send(vedio)}
})
//获取用户表总行数
admin.get('/usercount',async(req,res)=>{
    let model=await User.count({where:{}})
    if(model){return res.send({model})}
})
//获取新闻表新闻数据
admin.get('/newsall',async(req,res)=>{
    let model=await News.findAll()
    if(model){return res.send({model})}
})
//新建新闻
admin.post('/CreateNews',async(req,res)=>{
    const {authorid,author,title,titlecover,category,context,readership,givelike,collet,createdAt,vedio,status}=req.body;
    let s=await News.max('newsid')
    s=s+1
    let model=await News.create({newsid:`${s}`,authorid:`${authorid}`,author:`${author}`,title:`${title}`,titlecover:`${titlecover}`,category:`${category}`,context:`${context}`,readership:`${readership}`,givelike:`${givelike}`,collet:`${collet}`, crearedAt:`${createdAt}`,vedio:`${vedio}`,status:`${status}`})
    if(model){return res.send({model})}
})
//获取新建时用户存不存在
admin.post('/existuser',async(req,res)=>{
    const {authorid,author}=req.body
    const model= await User.findOne({where:{userid:`${authorid}`,username:`${author}`}})
    if(model){return res.send({msg:'存在'})}
    else{return res.send({msg:'不存在'})}
})
//获取各类新闻的数量
admin.get('/categorycount',async(req,res)=>{
    const model1=await News.count({where:{category:'学校新闻'}})
    const model2=await News.count({where:{category:'学习新闻'}})
    const model3=await News.count({where:{category:'生活情感新闻'}})
    const model4=await News.count({where:{category:'各级活动新闻'}})
    const model5=await News.count({where:{category:'体育文化艺术新闻'}})
    if(model1){return res.send({model1,model2,model3,model4,model5})}
})
//删除新闻
admin.post('/denews',async(req,res)=>{
    const {newsid}=req.body;
    const model=await News.destroy({where:{newsid}})
    if(model){return res.send({msg:'删除成功'})}
})
//更改新闻
admin.post('/upnews',async(req,res)=>{
    const {newsid,authorid,author,title,titlecover,category,context,vedio,readership,givelike,collet,updatedAt}=req.body;
    const model=await News.update({authorid,author,title,titlecover:`${titlecover.Image}`,category,context,vedio,readership,givelike,collet,updatedAt},{where:{newsid}})
    if(model){return res.send({msg:'成功'})}
})
//搜索新闻
admin.post('/searchnews',async(req,res)=>{
    const {newsid,title,authorid,author,category,context}=req.body;
    if(newsid!=0){
        const model=await News.findAll({where:{newsid:{[Op.like]:`%${newsid}%`}}})
        if(model){return res.send({model})}
    }
    else if(title!=''){
        const model=await News.findAll({where:{title:{[Op.like]:`%${title}%`}}})
        if(model){return res.send({model})}
    }
    else if(authorid!=0){
        const model=await News.findAll({where:{authorid:{[Op.like]:`%${authorid}%`}}})
        if(model){return res.send({model})}
    }
    else if(author!=''){
        const model=await News.findAll({where:{author:{[Op.like]:`%${author}%`}}})
        if(model){return res.send({model})}
    }
    else if(category!=''){
        const model=await News.findAll({where:{category:{[Op.like]:`%${category}%`}}})
        if(model){return res.send({model})}
    }
    else if(context!=''){
        const model=await News.findAll({where:{context:{[Op.like]:`%${context}%`}}})
        if(model){return res.send({model})}
    }
})
//新闻表总条目
admin.get('/newscount',async(req,res)=>{
    const model=await News.count({where:{}})
    if(model){return res.send({model})}
})
//获取评论表数据
admin.get('/reviewall',async(req,res)=>{
    const model=await Review.findAll()
    if(model){return res.send({model})}
})
//获取新建评论时是否有该条新闻和作者
admin.post('/checkids',async(req,res)=>{
    const {newsid,authorid}=req.body;
    const model=await User.findOne({where:{userid:`${authorid}`}})
    const model2=await News.findOne({where:{newsid}})
    if(model && model2){return res.send({msg:'true'})}
    else{return res.send({msg:'false'})}
})
//新建评论
admin.post('/createreview',async(req,res)=>{
    const {reviewid,newsid,authorid,context,relike,parentid,crearedAt}=req.body
    const model=await Review.create({reviewid,newsid,authorid,context,relike,parentid,crearedAt})
    if(model){return res.send({model})}
})
//更新评论
admin.post('/updatereview',async(req,res)=>{
    const {reviewid,newsid,authorid,context,relike,updatedAt}=req.body
    const model=await Review.update({newsid,authorid,context,relike,updatedAt},{where:{reviewid}})
    if(model){return res.send({model})}
})
//删除评论
admin.post('/dereview',async(req,res)=>{
    const {reviewid}=req.body
    const model=await Review.destroy({where:{reviewid}})
    if(model){return res.send({msg:'成功删除'})}
})
//获得评论总条目
admin.get('/countreview',async(req,res)=>{
    const model=await Review.count({where:{}})
    if(model){return res.send({model})}
})
//搜索评论
admin.post('/serachrevire',async(req,res)=>{
    const {reviewid,newsid,authorid,context}=req.body
    if(reviewid!=0){
        const model=await Review.findAll({where:{reviewid:{[Op.like]:`%${reviewid}%`}}})
        if(model){return res.send({model})}
    }else if(newsid!=0){
        const model=await Review.findAll({where:{newsid:{[Op.like]:`%${newsid}%`}}})
        if(model){return res.send({model})}
    }else if(authorid!=0){
        const model=await Review.findAll({where:{authorid:{[Op.like]:`%${authorid}%`}}})
        if(model){return res.send({model})}
    }else if(context!=''){
        const model=await Review.findAll({where:{context:{[Op.like]:`%${context}%`}}})
        if(model){return res.send({model})}
    }else{
        const model=await Review.findAll({where:{}})
        if(model){return res.send({model})}
    }
})
//获取近五日评论数量
admin.post('/sevenreview',async(req,res)=>{
    let {arr1,currentdate}=req.body;
    let arr2=[]
    for(let i=1;i<arr1.length;i++){
        if(i==1){
            const model=await Review.count({where:{createdAt:{[Op.between]: [`${arr1[1]}`, `${arr1[0]}`]}}})//07:59:59  08:00:00
            arr2.push(model)
        }else{
            const model=await Review.count({where:{createdAt:{[Op.between]: [`${arr1[i]}`, `${arr1[i-1]}`]}}})//07:59:59  08:00:00
            arr2.push(model)
        }
    }
    res.send({arr2})
})
//获取近五日新闻数量
admin.post('/fivenewscount',async(req,res)=>{
    let {arr1,currentdate}=req.body;
    let arr2=[]
    for(let i=1;i<arr1.length;i++){
        let model=await News.count({where:{createdAt:{[Op.between]: [`${arr1[i]}`, `${arr1[i-1]}`]}}})//07:59:59  08:00:00
        arr2.push(model)
    }
    res.send({arr2})
})
//获取粉丝数前10用户
admin.get('/qian10',async(req,res)=>{
    const model=await User.findAll({limit:10,order:[['fans','DESC']]})
    if(model){res.send({model})}
})
//获取新闻审核表数据
admin.get('/newsauditall',async(req,res)=>{
    let model=await Newsaudit.findAll()
    if(model){return res.send({model})}
})
//删除新闻审核表新闻
admin.post('/newsauditdelete',async(req,res)=>{
    const {newsid}=req.body
    const model=await Newsaudit.destroy({where:{newsid}})
    if(model){return res.send({msg:'审核通过'})}
    else{return res.send({msg:'审核失败'})}
})
//搜索审核表新闻
admin.post('/selectnewsaudit',async(req,res)=>{
    const {search,searchcategory}=req.body
    if(searchcategory=='newsid'){
        const model=await Newsaudit.findAll({where:{newsid:{[Op.like]:`%${search}%`}}})
        if(model){return res.send({model})}
    }else if(searchcategory=='authorid'){
        const model=await Newsaudit.findAll({where:{authorid:{[Op.like]:`%${search}%`}}})
        if(model){return res.send({model})}
    }else if(searchcategory=='author'){
        const model=await Newsaudit.findAll({where:{author:{[Op.like]:`%${search}%`}}})
        if(model){return res.send({model})}
    }else if(searchcategory=='title'){
        const model=await Newsaudit.findAll({where:{title:{[Op.like]:`%${search}%`}}})
        if(model){return res.send({model})}
    }else if(searchcategory=='category'){
        const model=await Newsaudit.findAll({where:{category:{[Op.like]:`%${search}%`}}})
        if(model){return res.send({model})}
    }else if(searchcategory=='context'){
        const model=await Newsaudit.findAll({where:{context:{[Op.like]:`%${search}%`}}})
        if(model){return res.send({model})}
    }else if(search==''){   
        const model=await Newsaudit.findAll({where:{}})
        if(model){return res.send({model})}
    }
})
//新建新闻审核失败表
admin.post('/newslosecreate',async(req,res)=>{
    const {newsid,authorid,author,title,titlecover,category,context,readership,givelike,collet,createdAt,vedio,status}=req.body;
    const model2=await Newslose.max('newsid')
    id=model2+1
    let model=await Newslose.create({
        newsid:`${id}`,
        authorid:`${authorid}`,
        author:`${author}`,
        title:`${title}`,
        titlecover:`${titlecover}`,
        category:`${category}`,
        context:`${context}`,
        readership:`${readership}`,
        givelike:`${givelike}`,
        collet:`${collet}`,
        crearedAt:`${createdAt}`,
        vedio:`${vedio}`,
        status:`${status}`
    })
    if(model){return res.send({model})}
})
//发送短信验证码
admin.post('/shortmessage',async(req,res)=>{
    const {tel_number}=req.body;
    let smsCode = Math.random().toString().slice(-6);//发送的短信验证码
    console.log(smsCode)
    // res.send({smsCode})
    const Core = require('@alicloud/pop-core');
    var client = new Core({
  // Please ensure that the environment variables ALIBABA_CLOUD_ACCESS_KEY_ID and ALIBABA_CLOUD_ACCESS_KEY_SECRET are set.
  accessKeyId:'LTAI5t7xp6d8ca9Kqj3Ui1hA',
  accessKeySecret:'hMrtyYAfwreRjCdFce3OtexDqea40h',
  // securityToken: process.env['ALIBABA_CLOUD_SECURITY_TOKEN'], // use STS Token
  endpoint: 'https://dysmsapi.aliyuncs.com',
  apiVersion: '2017-05-25'
    });
    var params = {
  "SignName": "阿里云短信测试",
  "TemplateCode": "SMS_154950909",
  "PhoneNumbers": `${tel_number}`,
  "TemplateParam": `{"code":'${smsCode}'}`
    }
    var requestOption = {
  method: 'POST',
  formatParams: false,

    };
client.request('SendSms', params, requestOption).then((result) => {
  console.log(JSON.stringify(result))
  return res.send({smsCode})//成功后返回验证码
}, (ex) => {
  console.log(ex);
})
})
//查看手机号是否存在
admin.post('/existphone',async(req,res)=>{
    const {phone}=req.body
    let model=await User.findOne({where:{phone}})
    if(model){return res.send({data:'true'})}
    else{return res.send({data:'false'})}
})
//测试富文本
admin.post('/richtext',async(req,res)=>{
    const {newsid,context}=req.body
    const model=await News.update({context:`${context}`},{where:{newsid:`${newsid}`}})
    if(model){return res.send({model})}
})
//手机登录寻找用户信息
admin.post('/phoneuser',async(req,res)=>{
    const phonetext=req.body
    const model1=await User.findOne({where:{phone:`${phonetext.phone}`}})
    if(model1){
        return res.send({model1})
    }
})
//所有收藏信息
admin.get('/collectall',async(req,res)=>{
    const model=await Newscollect.findAll()
    res.send({model})
})
//添加收藏
admin.post('/creaetcollect',async(req,res)=>{
    let {userid,newsid}=req.body;
    let maxid;
    let model;
    const model2=await Newscollect.findAll({where:{userid,newsid}})
    console.log(model2)
    async function create(){
        maxid= await Newscollect.max('collectsid')+1
        model=await Newscollect.create({collectsid:`${maxid}`,userid,newsid})
        if(model){res.send({msg:'成功'})}
        else{
            create()
        }
    }
    if(model2.length==0){
        create()
    }else{
        res.send({msg:'已经存在'})
    }
    

})
//更新收藏
admin.post('/updatecollect',async(req,res)=>{
    let {collectsid,userid,newsid}=req.body
    const model2=await Newscollect.findAll({where:{userid,newsid}})
    
    if(model2.length==0){
        const model=await Newscollect.update({userid,newsid},{where:{collectsid}})
        if(model){res.send({msg:'成功'})}
    }else{
        res.send({msg:'已经存在'})
    }
})
//删除收藏
admin.post('/deletecollect',async(req,res)=>{
    const {collectsid}=req.body
    const model=await Newscollect.destroy({where:{collectsid}})
    if(model){res.send({msg:'成功'})}
})
//搜素新闻收藏
admin.post('/searchcollect',async(req,res)=>{
    const {collectsid,userid,newsid}=req.body
    if(collectsid!=0){
        const model=await Newscollect.findAll({where:{collectsid:{[Op.like]:`%${collectsid}%`}}})
        if(model){res.send({model})}
    }else if(userid!=0){
        const model=await Newscollect.findAll({where:{userid:{[Op.like]:`%${userid}%`}}})
        if(model){res.send({model})}
    }else{
        const model=await Newscollect.findAll({where:{newsid:{[Op.like]:`%${newsid}%`}}})
        if(model){res.send({model})}
    }
})
//获取新闻搜藏前五
admin.get('/qianwucollet',async(req,res)=>{
    const model=await News.findAll({limit:5,order:[['collet','DESC']]})
    if(model){res.send({model})}
})
//获取全部关注信息
admin.get('/allconcern',async(req,res)=>{
    const model=await Concern.findAll()
    res.send({model})
})
//创建关注
admin.post('/createconcern',async(req,res)=>{
    let {userid,authorid}=req.body
    const model2=await Concern.findAll({where:{userid,authorid}})
    if(model2.length!=0){res.send({msg:'已经存在'})}
    else{
    let s=await Concern.max('concernid')
    s=s+1
    const model=await Concern.create({concernid:`${s}`,userid,authorid})
    if(model){res.send({msg:'成功'})}
    else{res.send({msg:'失败'})}
    }
})
//更新关注
admin.post('/updateconcern',async(req,res)=>{
    let {concernid,userid,authorid}=req.body;
    const model2=await Concern.findAll({where:{userid,authorid}})
    if(model2.length!=0){
        res.send({msg:'已经存在'})
    }else{
        const model=await Concern.update({userid:`${userid}`,authorid:`${authorid}`},{where:{concernid:`${concernid}`}})
        if(model.length!=0){res.send({msg:'成功'})}
        else{
            res.send({msg:'失败'})
        }
    }

})
//删除关注
admin.post('/deleteconcern',async(req,res)=>{
    let {concernid}=req.body
    const model=await Concern.destroy({where:{concernid}})
    if(model){res.send({msg:'删除成功'})}
})
//搜索关注
admin.post('/seaconcern',async(req,res)=>{
    const {concernid,userid,authorid}=req.body
    if(concernid!=0){
        const model=await Concern.findAll({where:{concernid:{[Op.like]:`%${concernid}%`}}})
        if(model){res.send({model})}
    }else if(userid!=0){
        const model=await Concern.findAll({where:{userid:{[Op.like]:`%${userid}%`}}})
        if(model){res.send({model})}
    }else{
        const model=await Concern.findAll({where:{authorid:{[Op.like]:`%${authorid}%`}}})
        if(model){res.send({model})}
    }
})
//搜索信息
admin.post('/searchsixin',async(req,res)=>{
    const {chatid,sendid,receiveid}=req.body
    if(chatid!=0){
        const model=await Chat.findAll({where:{chatid:{[Op.like]:`%${chatid}%`}}})
        if(model){res.send({model})}
    }else if(sendid!=0){
        const model=await Chat.findAll({where:{sendid:{[Op.like]:`%${sendid}%`}}})
        if(model){res.send({model})}
    }else{
        const model=await Chat.findAll({where:{receiveid:{[Op.like]:`%${receiveid}%`}}})
        if(model){res.send({model})}
    }
})
//获取新闻点赞列表
admin.get('/newslike',async(req,res)=>{
    const model=await Newslike.findAll()
    if(model){res.send({model})}
})
//添加新闻点赞
admin.post('/createnewslike',async(req,res)=>{
    let {userid,newsid}=req.body
    const model2=await Newslike.findAll({where:{userid,newsid}})
    if(model2.length!=0){res.send({msg:'已经存在'})}
    else{
    let s=await Newslike.max('newslikeid')
    s=s+1
    const model=await Newslike.create({newslikeid:`${s}`,userid,newsid})
    if(model){res.send({msg:'成功'})}
    else{res.send({msg:'失败'})}
    }
})
//更新新闻点赞
admin.post('/updatenewslike',async(req,res)=>{
    let {newslikeid,userid,newsid}=req.body;
    const model2=await Newslike.findAll({where:{userid,newsid}})
    if(model2.length!=0){
        res.send({msg:'已经存在'})
    }else{
        const model=await Newslike.update({userid:`${userid}`,newsid:`${newsid}`},{where:{newslikeid:`${newslikeid}`}})
        if(model.length!=0){res.send({msg:'成功'})}
        else{
            res.send({msg:'失败'})
        }
    }

})
//删除新闻点赞
admin.post('/deletenewslike',async(req,res)=>{
    let {newslikeid}=req.body
    const model=await Newslike.destroy({where:{newslikeid}})
    if(model){res.send({msg:'删除成功'})}
})
//搜索新闻点赞
admin.post('/seanewslike',async(req,res)=>{
    const {newslikeid,userid,newsid}=req.body
    if(newslikeid!=0){
        const model=await Newslike.findAll({where:{newslikeid:{[Op.like]:`%${newslikeid}%`}}})
        if(model){res.send({model})}
    }else if(userid!=0){
        const model=await Newslike.findAll({where:{userid:{[Op.like]:`%${userid}%`}}})
        if(model){res.send({model})}
    }else{
        const model=await Newslike.findAll({where:{newsid:{[Op.like]:`%${newsid}%`}}})
        if(model){res.send({model})}
    }
})
//获取评论点赞
admin.get('/reviewlike',async(req,res)=>{
    const model=await Reviewlike.findAll()
    if(model){res.send({model})}
})
//创建评论点赞
admin.post('/createreviewlike',async(req,res)=>{ 
    let {userid,reviewid}=req.body
    const model2=await Reviewlike.findAll({where:{userid,reviewid}})
    if(model2.length!=0){res.send({msg:'已经存在'})}
    else{
    let s=await Reviewlike.max('reviewlikeid')
    s=s+1
    const model=await Reviewlike.create({reviewlikeid:`${s}`,userid,reviewid})
    if(model){res.send({msg:'成功'})}
    else{res.send({msg:'失败'})}
    }
})
//更新评论点赞
admin.post('/updatereviewlike',async(req,res)=>{
    let {reviewlikeid,userid,reviewid}=req.body;
    const model2=await Reviewlike.findAll({where:{userid,reviewid}})
    if(model2.length!=0){
        res.send({msg:'已经存在'})
    }else{
        const model=await Reviewlike.update({userid:`${userid}`,reviewid:`${reviewid}`},{where:{reviewlikeid:`${reviewlikeid}`}})
        if(model.length!=0){res.send({msg:'成功'})}
        else{
            res.send({msg:'失败'})
        }
    }

})
//删除评论点赞
admin.post('/deletereviewlike',async(req,res)=>{
    let {reviewlikeid}=req.body
    const model=await Reviewlike.destroy({where:{reviewlikeid}})
    if(model){res.send({msg:'删除成功'})}
})
//搜索关注
admin.post('/seareviewlike',async(req,res)=>{
    const {reviewlikeid,userid,reviewid}=req.body
    if(reviewlikeid!=0){
        const model=await Reviewlike.findAll({where:{reviewlikeid:{[Op.like]:`%${reviewlikeid}%`}}})
        if(model){res.send({model})}
    }else if(userid!=0){
        const model=await Reviewlike.findAll({where:{userid:{[Op.like]:`%${userid}%`}}})
        if(model){res.send({model})}
    }else{
        const model=await Reviewlike.findAll({where:{reviewid:{[Op.like]:`%${reviewid}%`}}})
        if(model){res.send({model})}
    }
})
//获取所有聊天记录
admin.get('/allchat',async(req,res)=>{
    const model=await Chat.findAll()
    res.send({model})
})
//添加信息
admin.post('/addchats',async(req,res)=>{
    const {sendid,receiveid,context,createdAt}=req.body
    let s=await Chat.max('chatid')
    s=s+1
    const model=await Chat.create({chatid:`${s}`,sendid,receiveid,context})
    if(model){res.send({msg:'添加成功'})}
    else{res.send({msg:'添加失败'})}
})
//更新信息
admin.post('/updatechats',async(req,res)=>{
    const {chatid,sendid,receiveid,context}=req.body
    const model=await Chat.update({sendid:`${sendid}`,receiveid:`${receiveid}`,context:`${context}`},{where:{chatid:`${chatid}`}})
    if(model){res.send({msg:'更新成功'})}
    else{res.send({msg:'更新失败'})}
})
//删除信息
admin.post('/deletechats',async(req,res)=>{
    let {chatid}=req.body
    const model=await Chat.destroy({where:{chatid}})
    if(model){res.send({msg:'删除成功'})}
})
//获取用户数
admin.get('/countusers',async(req,res)=>{
    const model=await User.count()
    if(model){res.send({model})}
})
//获取新闻数
admin.get('/countnews',async(req,res)=>{
    const model=await News.count()
    if(model){res.send({model})}
})
//获取总阅读量
admin.get('/sumreadship',async(req,res)=>{
    const model=await News.sum('readership')
    if(model){res.send({model})}
})
////获取总评论数
admin.get('/countreview',async(req,res)=>{
    const model=await Review.count()
    if(model){res.send({model})}
})
//请求对应用户id的用户名
admin.post('/findusernaem',async(req,res)=>{
    const {userid}=req.body
    const model=await User.findOne({where:{userid}})
    if(model){res.send({model})}
    else{res.send({msg:'没有此作者'})}
})
//修改用户头像
admin.post('/updateusertx',async(req,res)=>{
    const {userid,avatarimage}=req.body
    const model=await User.update({avatarimage:`${avatarimage}`},{where:{userid}})
    if(model){res.send({msg:'修改成功'})}
})
//修改用户个性签名
admin.post('/updateuserselfas',async(req,res)=>{
    const {userid,selfas}=req.body
    const model=await User.update({selfas:`${selfas}`},{where:{userid}})
    if(model){res.send({msg:'修改成功'})}
})
module.exports=admin
