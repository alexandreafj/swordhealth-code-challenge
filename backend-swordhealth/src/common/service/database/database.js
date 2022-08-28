class Database {
  constructor() {}
  getConnection = async () => {
    const connection = require("knex")({
      client: "mysql2",
      connection: {
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASS,
        database: process.env.MYSQL_DATABASE,
      },
    });
    return { connection };
  };

  getTransaction = async () => {
    const knex = require("knex")({
      client: "mysql2",
      connection: {
        host: process.env.MYSQL_HOST,
        user: "root",
        password: "root",
        database: process.env.MYSQL_DATABASE,
      },
    });

    const transaction = await knex.transaction();

    return { transaction };
  };
}

module.exports = { Database };
