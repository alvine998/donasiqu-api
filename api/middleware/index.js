const db = require('../models')
const partners = db.partners
const Op = db.Sequelize.Op
require('dotenv').config()

exports.middlewareHere = async (req, res, next) => {
    try {
        if (req.header('bearer-token') !== "donasiquapi") {
            return res.status(401).send({
                message: "Access Denied!",
                code: 401
            })
        }
        next()
    } catch (error) {
        console.log(error);
    }
}