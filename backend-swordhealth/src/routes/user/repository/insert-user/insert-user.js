const { service } = require("../../../../common");

const insertUser = async ({ user }) => {
  const { transaction } = await service.database.getTransaction();
  try {
    await transaction
      .insert({
        email: user.email,
        name: user.name,
        password: user.password,
        role: user.role,
      })
      .into("users");
    service.database.commitTransaction({ transaction });
  } catch (error) {
    service.database.rollbackTransaction({ transaction });
    throw error;
  }
};

module.exports = { insertUser };
