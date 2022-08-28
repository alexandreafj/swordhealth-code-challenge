const { UserRepository } = require("../repository");
const { UserService } = require("./user-service/user-service");
const { service } = require("../../../common");

const { Database, bcrypt } = service;

const database = new Database();
const userRepository = new UserRepository({ database });

const usersService = new UserService({ userRepository, bcrypt });

module.exports = Object.freeze({
  usersService,
});
