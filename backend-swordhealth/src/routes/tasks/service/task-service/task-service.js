const Joi = require("joi");
const httpErrors = require("http-errors");
class TaskService {
  constructor({ taskRepository, userRepository }) {
    this.taskRepository = taskRepository;
    this.userRepository = userRepository;
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
  deleteTask = async ({ taskId }) =>
    await this.taskRepository.delete({ taskId });
  updateTask = async ({ task, user }) => {
    const taskId = task.id;
    delete task.id;
    const taskToUpdate = { ...task, updated_at: new Date() };
    const userId = user.id;

    const taskDb = await this.taskRepository.getById({ taskId, userId });
    const hasPerfomedTaskAlready = taskDb.perfomed_task !== null;
    if (hasPerfomedTaskAlready) {
      throw new httpErrors.BadRequest("Task already has been perfomed.");
    }

    await this.taskRepository.update({ taskId, task: taskToUpdate, userId });
    const [taskUpdated, managers] = await Promise.all([
      this.taskRepository.getById({ taskId, userId }),
      this.userRepository.getManagers(),
    ]);
    console.log(taskUpdated);
    console.log(managers.length);
    const hasManagersToNotify = managers.length > 0;
    const shouldNotify =
      hasManagersToNotify && taskUpdated.perfomed_task !== null;
    console.log(shouldNotify);
    if (shouldNotify) {
      //notify
    }
  };
}
module.exports = { TaskService };
