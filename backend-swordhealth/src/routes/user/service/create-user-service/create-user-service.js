const Joi = require("joi");
const repository = require("../../repository");
const userRepository = require("../../repository");

const validateCreateUserSchema = ({
  body = { email: "", name: "", password: "" },
}) => {
  const schema = Joi.object({
    email: Joi.string().email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    }),
    name: Joi.string().min(2),
    password: Joi.string().min(5),
  });

  const { email, name, password } = body;

  const { error } = schema.validate({ email, password, name });

  return error;
};

const createUserService = async ({ body }) => {
  const userWithTheSameEmail = await repository.findUserByEmail({
    email: body.email,
  });
  const hasFoundAnyUser = userWithTheSameEmail.length > 0;
  if (hasFoundAnyUser) {
    throw { message: "Email already exists.", statusCode: 409 };
  }
  await userRepository.insertUser({ user: body });
};

module.exports = {
  validateCreateUserSchema,
  createUserService,
};
