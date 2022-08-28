class UserRepository {
  constructor({ database }) {
    this.database = database;
  }
  findOne = async ({ email }) => {
    const { connection } = await this.database.getConnection();
    try {
      return await connection
        .select("id", "email", "password", "name", "role")
        .from("users")
        .where("email", email);
    } catch (error) {
      throw error;
    }
  };
  findByEmail = async ({ email }) => {
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
  insert = async ({ user }) => {
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
      transaction.commit();
    } catch (error) {
      transaction.rollback();
      throw error;
    }
  };
}
module.exports = { UserRepository };
