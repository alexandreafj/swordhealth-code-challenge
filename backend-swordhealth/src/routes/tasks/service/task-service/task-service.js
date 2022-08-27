const Joi = require("joi");

class TaskService {
  constructor({ taskRepository }) {
    this.taskRepository = taskRepository;
  }
  validateCreateTaskSchema = ({ task = { name: "", summary: "" } }) => {
    const schema = Joi.object({
      name: Joi.string().min(5),
      summary: Joi.string().min(5).max(2500),
    });

    const { name, summary } = task;

    const { error } = schema.validate({ name, summary });

    return error;
  };
  createTask = async ({ task, user }) => {
    task.user_id = user.id;
    task.created_at = new Date();
    await this.taskRepository.insert({ task });
  };
  getTasks = async ({ user, filters }) => {
    const tasks = await this.taskRepository.getAll({ user, filters });
    return tasks;
  };
}
module.exports = { TaskService };
