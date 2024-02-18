const { DataTypes } = require("sequelize");//评论表
const {sequelize,Sequelize}=require("../index")

    const review = sequelize.define('review', {
        // 属性
        reviewid: {
            type:DataTypes.INTEGER,
            primaryKey:true,
            unique:true,
            notEmpty:true
        },
        newsid:{
            type:DataTypes.INTEGER,
            notEmpty:true
        },
        authorid:{
            type:DataTypes.INTEGER,
            defaultValue:1
        },
        context:{
            type:DataTypes.TEXT
        },
        relike:{
          type:DataTypes.INTEGER,
          defaultValue:0
        },
        parentid:{
          type:DataTypes.INTEGER,
          notEmpty:true,
          defaultValue:0
        }
      }, {
        // 参数
      });
      review.sync({}).then(() => {
        console.log("评论表已经同步")
      });
    
module.exports=review