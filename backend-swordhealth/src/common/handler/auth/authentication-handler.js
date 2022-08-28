const httpErrors = require("http-errors");
const { Jwt } = require("../../service");

const authenticationHandler = (
  req,
  securityDefinition,
  _bearer_token,
  callback
) => {
  const jwt = new Jwt();

  const removeBearerRegex = /^Bearer/g;

  const token = (_bearer_token || "").replace(removeBearerRegex, "").trim();

  const hasToken = !!token;

  if (hasToken === false) {
    throw new httpErrors.Unauthorized("missing token");
  }

  jwt.validateToken({ token });

  const tokenPayload = jwt.decode({ token });

  req.auth = tokenPayload;

  return callback();
};

module.exports = { authenticationHandler };
