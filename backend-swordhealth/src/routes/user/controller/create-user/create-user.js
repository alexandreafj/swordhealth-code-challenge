const {
  handler: { httpErrorHandler },
} = require("../../../../common");
const httpStatusCodes = require("http-status-codes");

const createUser = async (req, res, next) => {
  try {
    return res.status(httpStatusCodes.OK);
  } catch (error) {
    return httpErrorHandler({ req, res, error });
  }
};
module.exports = { createUser };
