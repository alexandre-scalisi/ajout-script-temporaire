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
    `CREATE DATABASE IF NOT EXISTS ${database}`,
    function (err, result) {
      if (err) throw err;
      console.log("Database created");
      const importer = new Importer({ host, user, password, database });
      // New onProgress method, added in version 5.0!
      importer.onProgress((progress) => {
        var percent =
          Math.floor(
            (progress.bytes_processed / progress.total_bytes) * 10000
          ) / 100;
        console.log(`${percent}% Completed`);
      });
      importer
        .import("dump.sql")
        .then(() => {
          var files_imported = importer.getImported();
          console.log(`${files_imported.length} SQL file(s) imported.`);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  );
  connection.end();
});
