const {
  handler: { httpErrorHandler },
} = require("../../../../common");
const { StatusCodes } = require("http-status-codes");
const { loginService } = require("../../service");

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.query;
    const { user } = await loginService.verifyCredentials({ email, password });
    const { token } = loginService.generateToken({ user });
    return res.status(StatusCodes.OK).send({ token });
  } catch (error) {
    return httpErrorHandler({ req, res, error });
  }
};
module.exports = { loginUser };
