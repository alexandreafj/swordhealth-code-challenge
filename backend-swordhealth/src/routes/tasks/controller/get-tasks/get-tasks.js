const {
  handler: { httpErrorHandler },
} = require("../../../../common");
const { StatusCodes } = require("http-status-codes");

const getTasks = async (req, res, next) => {
  try {
    return res.status(StatusCodes.OK).send({ tasks: [] });
  } catch (error) {
    return httpErrorHandler({ req, res, error });
  }
};
module.exports = { getTasks };
