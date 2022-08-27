const Joi = require("joi");
const httpErrors = require("http-errors");
const { format } = require("date-fns");
class TaskService {
  constructor({ taskRepository, userRepository, rabbitmq, redis }) {
    this.taskRepository = taskRepository;
    this.userRepository = userRepository;
    this.rabbitmq = rabbitmq;
    this.redis = redis;
  }
  validateCreateTaskSchema = ({ task }) => {
    const schema = Joi.object({
      name: Joi.string().min(5),
      summary: Joi.string().min(5).max(2500),
    });

    const { error } = schema.validate(task);

    return error;
  };
  validateUpdateTaskSchema = ({ task }) => {
    const schema = Joi.object({
      id: Joi.number(),
      name: Joi.string().min(5),
      summary: Joi.string().min(5).max(2500),
      perfomed_task_date: Joi.string(),
    });

    const { error } = schema.validate(task);

    return error;
  };
  createTask = async ({ task, user }) => {
    task.user_id = user.id;
    task.created_at = new Date();
    await this.taskRepository.insert({ task });
    const key = `sword:${user.id}:get`;
    await this.redis.del({ key });
  };
  getTasks = async ({ user, filters }) => {
    const key = `sword:${user.id}:get:${filters.limit}:${filters.offset}`;
    const rawData = await this.redis.get({ key });
    if (rawData) {
      const tasks = JSON.parse(rawData);
      return tasks;
    }
    const tasks = await this.taskRepository.getAll({ user, filters });
    await this.redis.set({ key, value: tasks });
    return tasks;
  };
  deleteTask = async ({ taskId, user }) => {
    await this.taskRepository.delete({ taskId });
    const key = `sword:${user.id}:get`;
    await this.redis.del({ key });
  };
  updateTask = async ({ task, user }) => {
    const taskId = task.id;
    delete task.id;
    const taskToUpdate = { ...task, updated_at: new Date() };
    const userId = user.id;

    const taskDb = await this.taskRepository.getById({ taskId, userId });
    const hasPerfomedTaskAlready = taskDb.perfomed_task_date !== null;
    if (hasPerfomedTaskAlready) {
      throw new httpErrors.BadRequest("Task already has been perfomed.");
    }

    await this.taskRepository.update({ taskId, task: taskToUpdate, userId });
    const key = `sword:${user.id}:get`;
    await this.redis.del({ key });
    const message = `The tech ${user.name} performed the task ${task.name} on date ${task.perfomed_task_date}`;
    this.rabbitmq.sendNotification({ message });
  };
}
module.exports = { TaskService };
