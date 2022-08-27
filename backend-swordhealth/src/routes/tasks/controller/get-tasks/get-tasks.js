const {
  handler: { httpErrorHandler },
} = require("../../../../common");
const { StatusCodes } = require("http-status-codes");
const { taskService } = require("../../service");

const getTasks = async (req, res, next) => {
  try {
    const {
      auth: { data: user } = { data: {} },
      query: filters = { limit: 10, offset: 0 },
    } = req;
    const tasks = await taskService.getTasks({ user, filters });
    return res.status(StatusCodes.OK).send({ tasks });
  } catch (error) {
    return httpErrorHandler({ req, res, error });
  }
};
module.exports = { getTasks };
