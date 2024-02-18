const { DataTypes } = require("sequelize");//新闻审核失败表
const {sequelize,Sequelize}=require("../index")

    const Newslose = sequelize.define('newslose', {
        // 属性
        newsid: {
          type:DataTypes.INTEGER,
          primaryKey:true,
          unique:true,
          notEmpty:true
        },
        authorid:{
            type:DataTypes.INTEGER,
            defaultValue:1
        },
        author:{
            type:DataTypes.STRING,
            defaultValue:'张三'
        },
        title:{
            type:DataTypes.STRING,
            notEmpty:true
        },
        titlecover:{//封面图片 
            type:DataTypes.STRING,
        },
        category:{//类别
            type:DataTypes.ENUM("学校新闻","学习新闻","生活情感新闻","各级活动新闻","体育文化艺术新闻")
        },
        context:{
            type:DataTypes.TEXT
        },
        vedio:{
            type:DataTypes.STRING
        },
        readership:{//阅读量
            type:DataTypes.INTEGER,
            defaultValue:0
        },
        givelike:{//点赞
            type:DataTypes.INTEGER,
            defaultValue:0
        },
        collet:{
            type:DataTypes.INTEGER,
            defaultValue:0
        },
        status:{
            type:DataTypes.BOOLEAN,
            defaultValue:-1
        }
      }, {
        // 参数
      });
      Newslose.sync({}).then(() => {
        console.log("新闻审核失败表已经同步")
      });
    
module.exports=Newslose