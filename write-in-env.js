const lineReader = require("line-reader");
const prompt = require("prompt");
const { promisify } = require("util");
const crypto = require("crypto");

const fs = require("fs");
if (!fs.existsSync(".env")) {
  fs.writeFileSync(".env", "utf8", (err) => {
    if (err) console.log(err);
  });
}

require("dotenv").config();

const env = {};

console.log();
console.log("Remplissez le .env");

env["DATABASE_HOST"] = process.env.DATABASE_HOST ?? "127.0.0.1";
env["DATABASE_USERNAME"] = process.env.DATABASE_USERNAME ?? "root";
env["DATABASE_PASSWORD"] = process.env.DATABASE_PASSWORD ?? "";
env["DATABASE_NAME"] = process.env.DATABASE_NAME ?? "cress";
env["DATABASE_PORT"] = process.env.DATABASE_PORT ?? 3306;
env["APP_KEYS"] =
  process.env.APP_KEYS ?? crypto.createHash("sha256").digest("hex");
env["JWT_SECRET"] =
  process.env.JWT_SECRET ?? crypto.createHash("sha256").digest("hex");
env["API_TOKEN_SALT"] =
  process.env.API_TOKEN_SALT ?? crypto.createHash("sha256").digest("hex");

(async () => {
  await promisify(lineReader.eachLine)(".env", function (line, last) {
    if (line.length === 0) return;

    if (line.split("=").length === 0 || line.split("=")[0].trim().length === 0)
      return;

    const key = line.split("=")[0];
    const value = line.split("=")[1] ?? "";

    env[key] = value;
  });

  prompt.start();
  prompt.message = "";

  promisify(prompt.get)(
    [
      "DATABASE_NAME",
      "DATABASE_PORT",
      "DATABASE_PASSWORD",
      "DATABASE_USERNAME",
      "DATABASE_HOST",
    ],
    function (err, result) {
      if (err) {
        return onErr(err);
      }
      Object.entries(result).forEach(([k, v]) => {
        if (env[k] === undefined) {
          env[k] = v.trim();
          return;
        }

        if (v.trim().length === 0) return;

        env[k] = v.trim();
      });

      const data = Object.entries(env)
        .map(([k, v]) => `${k}=${v}`)
        .join("\n");

      fs.writeFile(".env", data, "utf8", (err) => {
        if (err) console.log(err);
      });
    }
  );
})();
