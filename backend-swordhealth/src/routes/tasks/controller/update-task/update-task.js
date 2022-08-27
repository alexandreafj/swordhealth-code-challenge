const {
  handler: { httpErrorHandler },
} = require("../../../../common");
const { StatusCodes } = require("http-status-codes");

const updateTask = async (req, res, next) => {
  try {
    return res.status(StatusCodes.NO_CONTENT).send("");
  } catch (error) {
    return httpErrorHandler({ req, res, error });
  }
};
module.exports = { updateTask };
