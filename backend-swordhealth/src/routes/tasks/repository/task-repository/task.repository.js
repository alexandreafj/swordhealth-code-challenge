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
        .select("id", "user_id", "name", "summary", "perfomed_task_date")
        .from("tasks");
      if (user.role === "technician") query.where("user_id", user.id);
      query.limit(limit).offset(offset);
      return await query;
    } catch (error) {
      throw error;
    }
  };
  delete = async ({ taskId }) => {
    const { transaction } = await this.database.getTransaction();
    try {
      await transaction("tasks").where("id", taskId).del();
      this.database.commitTransaction({ transaction });
    } catch (error) {
      this.database.rollbackTransaction({ transaction });
      throw error;
    }
  };
  getById = async ({ taskId, userId }) => {
    const { connection } = await this.database.getConnection();
    try {
      return await connection
        .select("id", "user_id", "name", "summary", "perfomed_task_date")
        .from("tasks")
        .where("id", taskId)
        .andWhere("user_id", userId)
        .first();
    } catch (error) {
      throw error;
    }
  };
  update = async ({ task, userId, taskId }) => {
    const { transaction } = await this.database.getTransaction();
    try {
      await transaction("tasks")
        .where("id", taskId)
        .andWhere("user_id", userId)
        .update(task);
      this.database.commitTransaction({ transaction });
    } catch (error) {
      this.database.rollbackTransaction({ transaction });
      throw error;
    }
  };
}
module.exports = { TaskRepository };
