const {
  handler: { httpErrorHandler },
} = require("../../../../common");
const httpStatusCodes = require("http-status-codes");

const loginUser = async () => {
  try {
    return res.status(httpStatusCodes.OK);
  } catch (error) {
    return httpErrorHandler({ req, res, error });
  }
};
module.exports = { loginUser };
