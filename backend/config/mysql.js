const mysql = require("mysql");

const createMySQLConnection = () => {
  const connection = mysql.createConnection({
    host: process.env.UBUNTUHOST,
    user: process.env.UBUNTUUSER,
    password: process.env.UBUNTUPASSWORD,
    database: process.env.UNIFYDB,
    port: process.env.UBUNTUPORT,
  });
  return connection;
};

module.exports = createMySQLConnection;
