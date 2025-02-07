const dbConfig = require("../../config");
const mysql2 = require("mysql2")

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operatorsAliases: false,
    dialectModule: mysql2,
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

db.users = require("./users.js")(sequelize, Sequelize);
db.categories = require("./categories.js")(sequelize, Sequelize);
db.news = require("./news.js")(sequelize, Sequelize);
db.ads = require("./ads.js")(sequelize, Sequelize);
db.kurs = require("./kurs.js")(sequelize, Sequelize);

module.exports = db;