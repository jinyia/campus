const { DataTypes } = require("sequelize");//新闻收藏表
const {sequelize,Sequelize}=require("../index")

    const newscollect = sequelize.define('newscollect', {
        // 属性
        //newscollects
        collectsid:{
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
      newscollect.sync({}).then(() => {
        console.log("新闻收藏表已经同步")
      });
    
module.exports=newscollect