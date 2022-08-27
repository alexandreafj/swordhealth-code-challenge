const { UserRepository } = require("../repository");
const { UserService } = require("./user-service/user-service");
const { service } = require("../../../common");

const { database, bcrypt } = service;

const userRepository = new UserRepository({ database });

const usersService = new UserService({ userRepository, bcrypt });

module.exports = Object.freeze({
  usersService,
});
