const { TaskRepository } = require("../repository");
const { UserRepository } = require("../../user/repository");
const { TaskService } = require("./task-service/task-service");
const { service } = require("../../../common");

const { database, rabbitmq, redis } = service;

const taskRepository = new TaskRepository({ database });
const userRepository = new UserRepository({ database });

const taskService = new TaskService({
  taskRepository,
  userRepository,
  rabbitmq,
  redis,
});

module.exports = Object.freeze({
  taskService,
});
