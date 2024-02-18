const { DataTypes, ENUM } = require("sequelize");//用户表
const {sequelize,Sequelize}=require("../index");

const User = sequelize.define('user', {
    // 属性
    userid:{
      type:DataTypes.INTEGER,
      primaryKey:true,
      notEmpty:true,
      unique:true,
      field:'userid'
    },
    username: {
      type: Sequelize.STRING,
      validator:{
        notEmpty:true
      },
      field:'username'
    },
    selfas:{
      type:DataTypes.TEXT
    },
    avatarimage: {
      type: Sequelize.STRING,
    },
    password: {
        type: Sequelize.STRING,
        validator:{
            notEmpty:true
          }
    },
    phone:{
      type:Sequelize.STRING
    },
    sex:{
      type:DataTypes.ENUM("男","女")
    },
    eamil:{
      type:DataTypes.STRING
    },
    fans:{
      type:DataTypes.INTEGER,
      defaultValue:0
    },
    follow:{
      type:DataTypes.INTEGER,
      defaultValue:0
    }
  }, {
    // 参数
  });

  // 注意:如果表已经存在,使用`force:true`将删除该表
User.sync({}).then(() => {
    console.log("用户表已经同步")
  });

module.exports=User