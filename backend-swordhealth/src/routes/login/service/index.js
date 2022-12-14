const { UserRepository } = require("../../user/repository");
const { LoginService } = require("./login-service/login-service");
const { service } = require("../../../common");

const { Database, Bcrypt, Jwt } = service;

const bcrypt = new Bcrypt();
const jwt = new Jwt();
const database = new Database();
const userRepository = new UserRepository({ database });

const loginService = new LoginService({ userRepository, bcrypt, jwt });

module.exports = Object.freeze({
  loginService,
});
