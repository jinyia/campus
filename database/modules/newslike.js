const { DataTypes } = require("sequelize");//新闻点赞表
const {sequelize,Sequelize}=require("../index")

    const newslike = sequelize.define('newslike', {
        // 属性
        newslikeid: {
          type:DataTypes.INTEGER,
          primaryKey:true,
          unique:true,
          notEmpty:true
        },
        userid: {
            type:DataTypes.INTEGER,
          notEmpty:true
        },
        newsid:{
            type:DataTypes.INTEGER,
            notEmpty:true
        }
      }, {
        // 参数
      });
      newslike.sync({}).then(() => {
        console.log("新闻点赞表已经同步")
      });
    
module.exports=newslike