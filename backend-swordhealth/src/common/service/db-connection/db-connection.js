const getConnection = async ({ db }) => {
  const knex = require("knex")({
    client: "mysql",
    connection: {
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASS,
      database: db,
    },
  });
  return knex;
};

const getTransaction = async ({ db }) => {
  const knex = require("knex")({
    client: "mysql",
    connection: {
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASS,
      database: db,
    },
  });

  const transaction = await knex.transaction();

  return { transaction };
};

const commitTransaction = ({ transaction }) => transaction.commit();

const rollbackTransaction = ({ transaction }) => transaction.rollback();

module.exports = {
  database: {
    getConnection,
    getTransaction,
    commitTransaction,
    rollbackTransaction,
  },
};
