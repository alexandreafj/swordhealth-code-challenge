const { TaskRepository } = require("../repository");
const { UserRepository } = require("../../user/repository");
const { TaskService } = require("./task-service/task-service");
const { service } = require("../../../common");

const { database, rabbitmq } = service;

const taskRepository = new TaskRepository({ database });
const userRepository = new UserRepository({ database });

const taskService = new TaskService({
  taskRepository,
  userRepository,
  rabbitmq,
});

module.exports = Object.freeze({
  taskService,
});
