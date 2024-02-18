const {sequelize,Sequelize}=require("../index")//表管理员表

    const Admin = sequelize.define('admin', {
        // 属性
        adminname: {
          type: Sequelize.STRING,
          validator:{
            notEmpty:true
          }
        },
        password: {
            type: Sequelize.STRING,
            validator:{
                notEmpty:true
              }
        }
      }, {
        // 参数
      });
      Admin.sync({}).then(() => {
        console.log("管理员表已经同步")
      });
    
module.exports=Admin