const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('news', {
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
    slug: {
      type: DataTypes.STRING(250),
      allowNull: false
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    category_name: {
      type: DataTypes.STRING(250),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    thumbnail: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    author: {
      type: DataTypes.STRING(250),
      allowNull: false
    },
    editor: {
      type: DataTypes.STRING(250),
      allowNull: false
    },
    source: {
      type: DataTypes.STRING(250),
      allowNull: false
    },
    keywords: {
      type: DataTypes.JSON,
      allowNull: false
    },
    viewers: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    headline: {
      type: DataTypes.TINYINT,
      allowNull: false
    },
    breaking_news: {
      type: DataTypes.TINYINT,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('draft','publish'),
      allowNull: false
    },
    published_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'news',
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
        name: "idx_deleted_at_name_slug",
        using: "BTREE",
        fields: [
          { name: "deletedAt" },
          { name: "title" },
          { name: "slug" },
        ]
      },
    ]
  });
};
