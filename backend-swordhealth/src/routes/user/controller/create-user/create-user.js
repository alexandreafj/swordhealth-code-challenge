const {
  handler: { httpErrorHandler },
  service: { bcrypt },
} = require("../../../../common");
const httpStatusCodes = require("http-status-codes");

const userService = require("../../service");

const createUser = async (req, res, next) => {
  try {
    const { body } = req;
    const hasErrorOnSchemaValidation = userService.validateCreateUserSchema({
      body,
    });
    if (hasErrorOnSchemaValidation) {
      return res
        .status(httpStatusCodes.BAD_REQUEST)
        .send(hasErrorOnValidations);
    }
    await userService.createUserService({ body });
    return res.status(httpStatusCodes.OK).send("user has been created");
  } catch (error) {
    return httpErrorHandler({ req, res, error });
  }
};
module.exports = { createUser };
