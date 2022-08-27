const { TaskRepository } = require("../repository");
const { TaskService } = require("./task-service/task-service");
const { service } = require("../../../common");

const { database } = service;

const taskRepository = new TaskRepository({ database });

const taskService = new TaskService({ taskRepository });

module.exports = Object.freeze({
  taskService,
});
