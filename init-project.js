const mysql = require("mysql2");
const Importer = require("mysql-import");
require("dotenv").config();

const host = process.env.DATABASE_HOST ?? "127.0.0.1";
const user = process.env.DATABASE_USERNAME ?? "root";
const password = process.env.DATABASE_PASSWORD ?? "root";
const database = process.env.DATABASE_NAME ?? "db_cress";
const port = process.env.DATABASE_PORT ?? 3306;

const connection = mysql.createConnection({
  host,
  user,
  password,
  port: +port,
});

connection.connect(function (err) {
  connection.query(
    `CREATE DATABASE IF NOT EXISTS \`${database}\` CHARACTER SET utf8 COLLATE utf8_general_ci;`,
    function (err, result) {
      if (err) throw err;
      console.log("Database created");
      const importer = new Importer({ host, user, password, database, port });
      importer
        .import("dump.sql")
        .then(() => console.log("Database imported successfully"))
        .catch((err) => console.error(err));
    }
  );
  connection.end();
});
