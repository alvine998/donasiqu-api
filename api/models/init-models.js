var DataTypes = require("sequelize").DataTypes;
var _banners = require("./banners");
var _users = require("./users");

function initModels(sequelize) {
  var banners = _banners(sequelize, DataTypes);
  var users = _users(sequelize, DataTypes);


  return {
    banners,
    users,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
