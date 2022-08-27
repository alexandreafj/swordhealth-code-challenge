const {
  handler: { httpErrorHandler },
} = require("../../../../common");
const { StatusCodes } = require("http-status-codes");
const { taskService } = require("../../service");

const deleteTask = async (req, res, next) => {
  try {
    const { auth: { data: user } = { data: {} } } = req;
    const isUserTechnician = user.role === "technician";
    if (isUserTechnician) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .send("User is not authorized to perfom this action");
    }
    const { taskId } = req.query;
    await taskService.deleteTask({ taskId });
    return res.status(StatusCodes.NO_CONTENT).send("");
  } catch (error) {
    return httpErrorHandler({ req, res, error });
  }
};
module.exports = { deleteTask };
