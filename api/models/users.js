const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('users', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    code: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING(13),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    pob: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    dob: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    agreement: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0
    },
    password: {
      type: DataTypes.STRING(250),
      allowNull: false
    },
    verified: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    is_reset: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    verify_token: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    role: {
      type: DataTypes.ENUM('super_admin','admin','foundation','donor'),
      allowNull: false,
      defaultValue: "donor"
    },
    otp: {
      type: DataTypes.STRING(6),
      allowNull: true
    },
    status: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1
    },
    created_on: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    updated_on: {
      type: DataTypes.DATE,
      allowNull: true
    },
    deleted: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0,
      unique: "deleted"
    }
  }, {
    sequelize,
    tableName: 'users',
    timestamps: false,
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
        name: "deleted",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "deleted" },
        ]
      },
    ]
  });
};
