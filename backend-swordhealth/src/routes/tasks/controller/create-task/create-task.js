const {
  handler: { httpErrorHandler },
} = require("../../../../common");
const { StatusCodes } = require("http-status-codes");

const createTask = async (req, res, next) => {
  try {
    return res.status(StatusCodes.CREATED).send("task has been created");
  } catch (error) {
    return httpErrorHandler({ req, res, error });
  }
};
module.exports = { createTask };
