class Database {
  constructor() {
    this.connection = require("knex")({
      client: "mysql2",
      connection: {
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASS,
        database: process.env.MYSQL_DATABASE,
      },
      pool: {
        min: Number(process.env.MYSQL_POOL_MIN),
        max: Number(process.env.MYSQL_POOL_MAX),
      },
      acquireConnectionTimeout: 10000,
    });
  }
  getConnection = async () => {
    return { connection: this.connection };
  };

  getTransaction = async () => {
    const transaction = await this.connection.transaction();
    return { transaction };
  };

  closeConnection = () => {
    this.connection.destroy();
  };
}

module.exports = { Database };
