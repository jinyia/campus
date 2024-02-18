const {sequelize,Sequelize}=require("../index")

    const image = sequelize.define('image', {
        // 属性
        Image: {
          type: Sequelize.BLOB('long'),
        }
      }, {
        // 参数
      });
      image.sync({}).then(() => {
        console.log("图片表表已经同步")
      });
    
module.exports=image