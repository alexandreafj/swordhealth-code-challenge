const Joi = require("joi");

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
    console.log(this.userRepository);
    const userWithTheSameEmail = await this.userRepository.findUserByEmail({
      email: body.email,
    });
    const hasFoundAnyUser = userWithTheSameEmail.length > 0;
    if (hasFoundAnyUser) {
      throw { message: "Email already exists.", statusCode: 409 };
    }
    body.password = this.bcrypt.generateHashPassword({
      password: body.password,
    });
    await this.userRepository.insertUser({ user: body });
  };
}
module.exports = { UserService };
