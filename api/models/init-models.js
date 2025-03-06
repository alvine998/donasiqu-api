var DataTypes = require("sequelize").DataTypes;
var _banners = require("./banners");
var _login_histories = require("./login_histories");
var _users = require("./users");

function initModels(sequelize) {
  var banners = _banners(sequelize, DataTypes);
  var login_histories = _login_histories(sequelize, DataTypes);
  var users = _users(sequelize, DataTypes);

  login_histories.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(login_histories, { as: "login_histories", foreignKey: "user_id"});

  return {
    banners,
    login_histories,
    users,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
