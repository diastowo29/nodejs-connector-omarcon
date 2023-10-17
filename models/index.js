const dbConfig = require("../config/db.config");
const Sequelize = require("sequelize");
let local_database_url = 'postgres://postgres:R@hasia@localhost:5432/omarcon';

if (process.env.DATABASE_URL == undefined) {
  console.log('undefined')
}

var sequelize;


try {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
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
} catch (e) {
  sequelize = new Sequelize('postgres://postgres:R@hasia@localhost:5432/omarcon', {
    dialect: dbConfig.dialect,
    operatorsAliases: false,
    pool: {
      max: dbConfig.pool.max,
      min: dbConfig.pool.min,
      acquire: dbConfig.pool.acquire,
      idle: dbConfig.pool.idle
    }
  });
}


const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.zdConnection = require("./tb_zdconnection")(sequelize, Sequelize);
db.zdMarketplaces = require("./tb_marketplaces")(sequelize, Sequelize);

module.exports = db;