const {
  handler: { httpErrorHandler },
} = require("../../../../common");
const { StatusCodes } = require("http-status-codes");
const { taskService } = require("../../service");

const updateTask = async (req, res, next) => {
  try {
    const { body: task, auth: { data: user } = { data: {} } } = req;
    const isUserManager = user.role === "manager";
    if (isUserManager) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .send("User is not authorized to perfom this action");
    }
    const shouldUpdate = Object.keys(task).length > 1;
    if (shouldUpdate) {
      await taskService.updateTask({ task, user });
    }
    return res.status(StatusCodes.NO_CONTENT).send("");
  } catch (error) {
    return httpErrorHandler({ req, res, error });
  }
};
module.exports = { updateTask };
