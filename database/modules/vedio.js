const {sequelize,Sequelize}=require("../index")

    const Vedio = sequelize.define('vedio', {
        // 属性
        vedio: {
          type: Sequelize.BLOB('long'),
        }
      }, {
        // 参数
      });
      Vedio.sync({}).then(() => {
        console.log("视频表已经同步")
      });
    
module.exports=Vedio