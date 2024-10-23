const Sequelize = require("sequelize");
const db = require("../config/db");

const { DataTypes } = Sequelize;

const Bookmark = db.define(
  "bookmarks",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    imdbID: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    poster: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    plot: {
      type: DataTypes.STRING,
    },
    director: {
      type: DataTypes.STRING,
    },
    writer: {
      type: DataTypes.STRING,
    },
    userID: {
      type: DataTypes.STRING,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = Bookmark;
