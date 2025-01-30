const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ads', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING(250),
      allowNull: false
    },
    image: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    width: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    height: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM('header','side'),
      allowNull: false,
      defaultValue: "header"
    }
  }, {
    sequelize,
    tableName: 'ads',
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "idx_deleted_at_name",
        using: "BTREE",
        fields: [
          { name: "deletedAt" },
          { name: "title" },
        ]
      },
    ]
  });
};
