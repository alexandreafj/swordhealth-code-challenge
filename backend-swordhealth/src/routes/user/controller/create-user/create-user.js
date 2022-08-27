const {
  handler: { httpErrorHandler },
} = require("../../../../common");
const { StatusCodes } = require("http-status-codes");

const { usersService } = require("../../service");

const createUser = async (req, res, next) => {
  try {
    const { body } = req;
    const hasErrorOnSchemaValidation = usersService.validateCreateUserSchema({
      body,
    });
    if (hasErrorOnSchemaValidation) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send({ details: hasErrorOnSchemaValidation.details });
    }
    await usersService.createUser({ body });
    return res
      .status(StatusCodes.OK)
      .send({ message: "user has been created" });
  } catch (error) {
    return httpErrorHandler({ req, res, error });
  }
};
module.exports = { createUser };
