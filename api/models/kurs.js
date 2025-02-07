const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('kurs', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    idr: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    eur: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    jpy: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    cny: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    aud: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    krw: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    myr: {
      type: DataTypes.DOUBLE,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'kurs',
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
    ]
  });
};
