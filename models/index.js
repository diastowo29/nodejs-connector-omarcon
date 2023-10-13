const dbConfig = require("../config/db.config");
const Sequelize = require("sequelize");

// const sequelize = new Sequelize('postgres://postgres:R@hasia@localhost:5432/omarcon', {
//   dialect: dbConfig.dialect,
//   operatorsAliases: false,
//   pool: {
//     max: dbConfig.pool.max,
//     min: dbConfig.pool.min,
//     acquire: dbConfig.pool.acquire,
//     idle: dbConfig.pool.idle
//   }
// });
const sequelize = new Sequelize("postgres://pzcsmdczukiydi:9c5aeb510bd9cf696bdcf56fd4aa815a8ac8c4c309f1414377644c0958b6761f@ec2-3-229-161-70.compute-1.amazonaws.com:5432/dejjpttscbv6cu", {
  dialect: dbConfig.dialect,
  operatorsAliases: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
      },
      keepAlive: true,
  },      
  ssl: true,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.zdConnection = require("./tb_zdconnection")(sequelize, Sequelize);
db.zdMarketplaces = require("./tb_marketplaces")(sequelize, Sequelize);

module.exports = db;