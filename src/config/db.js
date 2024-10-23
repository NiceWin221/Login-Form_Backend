const Sequelize = require("sequelize");

// const db = new Sequelize("myDB", "root", "secretpassword", {
//   host: "localhost",
//   dialect: "mysql",
// });

const db = new Sequelize(
  process.env.MYSQL_DATABASE,
  process.env.MYSQLUSER,
  process.env.MYSQLPASSWORD,
  {
    host: process.env.MYSQLHOST,
    port: process.env.MYSQLPORT,
    dialect: "mysql",
  }
);

module.exports = db;
