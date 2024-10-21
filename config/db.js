const Sequelize = require("sequelize");

const db = new Sequelize("myDB", "root", "secretpassword", {
  host: "localhost",
  dialect: "mysql",
});

module.exports = db;
