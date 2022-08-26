const { service } = require("../../../../common");

const findUserByEmail = async ({ email }) => {
  const { connection } = await service.database.getConnection();
  try {
    return await connection.select("email").from("users").where("email", email);
  } catch (error) {
    throw error;
  }
};

module.exports = { findUserByEmail };
