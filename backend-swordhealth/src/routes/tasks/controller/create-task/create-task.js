const {
  handler: { httpErrorHandler },
} = require("../../../../common");
const { StatusCodes } = require("http-status-codes");
const { taskService } = require("../../service");

const createTask = async (req, res, next) => {
  try {
    const { body: task, auth: { data: user } = { data: {} } } = req;
    const userIsManager = user.role === "manager";
    if (userIsManager) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .send("User is not authorized to perfom this action");
    }
    const hasErrorOnSchemaValidation = taskService.validateCreateTaskSchema({
      task,
    });
    if (hasErrorOnSchemaValidation) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send({ details: hasErrorOnSchemaValidation.details });
    }
    await taskService.createTask({ task, user });
    return res
      .status(StatusCodes.CREATED)
      .send({ message: "task has been created" });
  } catch (error) {
    return httpErrorHandler({ req, res, error });
  }
};
module.exports = { createTask };
