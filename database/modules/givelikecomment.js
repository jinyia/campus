const { DataTypes } = require("sequelize");//评论点赞表
const {sequelize,Sequelize}=require("../index")

    const givelikecomment = sequelize.define('givelikecomment', {
        // 属性
        reviewlikeid: {
          type:DataTypes.INTEGER,
          primaryKey:true,
          unique:true,
          notEmpty:true
        },
        userid: {
            type:DataTypes.INTEGER,
          notEmpty:true
        },
        reviewid:{
            type:DataTypes.INTEGER,
            notEmpty:true
        }
      }, {
        // 参数
      });
      givelikecomment.sync({}).then(() => {
        console.log("评论点赞表已经同步")
      });
    
module.exports=givelikecomment