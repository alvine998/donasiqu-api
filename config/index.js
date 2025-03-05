require('dotenv').config()

module.exports = {
    HOST: process.env.DB_HOST || 'localhost',
    USER: process.env.DB_USER || "root",
    PASSWORD: process.env.DB_PASSWORD || "alvine1234",
    DB: process.env.DB_NAME || "donasiqu",
    dialect: "mysql",
    pool: {
        max: 10,
        min: 0,
        acquire: 50000,
        idle: 10000
    }
};