const { TaskRepository } = require("../repository");
const { UserRepository } = require("../../user/repository");
const { TaskService } = require("./task-service/task-service");
const { service } = require("../../../common");

const { Database, Rabbitmq, Cache } = service;

const rabbitmq = new Rabbitmq();
const database = new Database();
const cache = new Cache();
const taskRepository = new TaskRepository({ database });
const userRepository = new UserRepository({ database });

const taskService = new TaskService({
  taskRepository,
  userRepository,
  rabbitmq,
  cache,
});

module.exports = Object.freeze({
  taskService,
});
