const dbConfig = require("../config/db.config");
const Sequelize = require("sequelize");

const sequelize = new Sequelize('postgres://postgres:R@hasia@localhost:5432/omarcon', {
  dialect: dbConfig.dialect,
  operatorsAliases: false,
  dialectOptions: {
    // ssl: {
    //   require: true,
    //   rejectUnauthorized: false,
    //   },
    //   keepAlive: true,
  },      
//   ssl: true,
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

db.histories = require("./tb_zdconnection")(sequelize, Sequelize);

module.exports = db;