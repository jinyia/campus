const { DataTypes } = require("sequelize");//关注表
const {sequelize,Sequelize}=require("../index")
const User=require('./user')
    const chat = sequelize.define('chat', {
        // 属性
        chatid: {
          type:DataTypes.INTEGER,
          primaryKey:true,
          unique:true,
          notEmpty:true
        },
        sendid: {
            type:DataTypes.INTEGER,
            notEmpty:true,
            field:'sendid'
        },
        receiveid:{
            type:DataTypes.INTEGER,
            notEmpty:true,
            field:'receiveid'
        },
        context:{
            type:DataTypes.TEXT,
            defaultValue:'null'
        },
        avatarimage: {
          type: Sequelize.STRING,
          defaultValue:'null'
        }
      }, {
        // 参数
      });
      chat.belongsTo(User,{as:'Chats',foreignKey:'receiveid',targetkey:'userid'})
      chat.sync({}).then(() => {
        console.log("聊天表已经同步")
      });
module.exports=chat