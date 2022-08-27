const Joi = require("joi");
const httpErrors = require("http-errors");
class UserService {
  constructor({ userRepository, bcrypt }) {
    this.userRepository = userRepository;
    this.bcrypt = bcrypt;
  }
  validateCreateUserSchema = ({
    body = { email: "", name: "", password: "" },
  }) => {
    const emailRegex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    const schema = Joi.object({
      email: Joi.string().regex(emailRegex).email(),
      name: Joi.string().min(2),
      password: Joi.string().min(5),
    });

    const { email, name, password } = body;

    const { error } = schema.validate({ email, password, name });

    return error;
  };

  createUser = async ({ body }) => {
    const userWithTheSameEmail = await this.userRepository.findByEmail({
      email: body.email,
    });
    const hasFoundAnyUser = userWithTheSameEmail.length > 0;
    if (hasFoundAnyUser) {
      throw new httpErrors.Conflict("Email already exists");
    }
    body.password = this.bcrypt.generateHashPassword({
      password: body.password,
    });
    await this.userRepository.insert({ user: body });
  };
}
module.exports = { UserService };
