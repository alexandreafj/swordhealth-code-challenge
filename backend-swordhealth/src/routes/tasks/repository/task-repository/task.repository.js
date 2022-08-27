class TaskRepository {
  constructor({ database }) {
    this.database = database;
  }
  insert = async ({ task }) => {
    const { transaction } = await this.database.getTransaction();
    try {
      await transaction
        .insert({
          user_id: task.user_id,
          name: task.name,
          summary: task.summary,
          created_at: task.created_at,
        })
        .into("tasks");
      this.database.commitTransaction({ transaction });
    } catch (error) {
      this.database.rollbackTransaction({ transaction });
      throw error;
    }
  };
  getAll = async ({ user, filters: { offset, limit } }) => {
    const { connection } = await this.database.getConnection();
    try {
      const query = connection
        .select("id", "user_id", "name", "summary", "perfomed_task")
        .from("tasks");
      if (user.role === "technician") query.where("user_id", user.id);
      query.limit(limit).offset(offset);
      return await query;
    } catch (error) {
      throw error;
    }
  };
}
module.exports = { TaskRepository };
