const { UserRepository } = require("../../user/repository");
const { LoginService } = require("./login-service/login-service");
const { service } = require("../../../common");

const { database, bcrypt, jwt, redis } = service;

const userRepository = new UserRepository({ database });

const loginService = new LoginService({ userRepository, bcrypt, jwt, redis });

module.exports = Object.freeze({
  loginService,
});
