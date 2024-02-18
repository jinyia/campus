const { DataTypes } = require("sequelize");//关注表
const {sequelize,Sequelize}=require("../index")

    const concern = sequelize.define('concern', {
        // 属性
        concernid: {
          type:DataTypes.INTEGER,
          primaryKey:true,
          unique:true,
          notEmpty:true
        },
        userid: {
            type:DataTypes.INTEGER,
          notEmpty:true
        },
        authorid:{
            type:DataTypes.INTEGER,
            notEmpty:true
        }
      }, {
        // 参数
      });
      concern.sync({}).then(() => {
        console.log("关注表已经同步")
      });
    
module.exports=concern