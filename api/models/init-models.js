var DataTypes = require("sequelize").DataTypes;
var _ads = require("./ads");
var _categories = require("./categories");
var _kurs = require("./kurs");
var _news = require("./news");
var _users = require("./users");

function initModels(sequelize) {
  var ads = _ads(sequelize, DataTypes);
  var categories = _categories(sequelize, DataTypes);
  var kurs = _kurs(sequelize, DataTypes);
  var news = _news(sequelize, DataTypes);
  var users = _users(sequelize, DataTypes);


  return {
    ads,
    categories,
    kurs,
    news,
    users,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
