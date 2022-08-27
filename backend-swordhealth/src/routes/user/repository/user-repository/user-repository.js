class UserRepository {
  constructor({ database }) {
    this.database = database;
  }
  findUserByEmail = async ({ email }) => {
    const { connection } = await this.database.getConnection();
    try {
      return await connection
        .select("email")
        .from("users")
        .where("email", email);
    } catch (error) {
      throw error;
    }
  };
  insertUser = async ({ user }) => {
    const { transaction } = await this.database.getTransaction();
    try {
      await transaction
        .insert({
          email: user.email,
          name: user.name,
          password: user.password,
          role: user.role,
        })
        .into("users");
      this.database.commitTransaction({ transaction });
    } catch (error) {
      this.database.rollbackTransaction({ transaction });
      throw error;
    }
  };
}
module.exports = { UserRepository };
