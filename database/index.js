const Sequelize = require('sequelize');

const sequelize = new Sequelize('campus news', 'root', 'root', {
    host: 'localhost',
    port:'3306',
    dialect:'mysql',
    timezone:'+08:00',
    dialectOptions:{
      dateStrings:true,
      typeCast:true
    }
  });

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

module.exports={sequelize,Sequelize}