const httpErrors = require("http-errors");
const jwt = require("jsonwebtoken");

const tokenExpired = ({ token }) => {
  const tokenPayload = jwt.decode(token, {});

  const { exp, aud, iss } = tokenPayload;

  const unixFormat = 1000;

  const tokenDate = new Date(exp * unixFormat).getTime();

  const today = new Date().getTime();

  const hasTokenExpired = tokenDate < today;

  if (hasTokenExpired) throw new httpErrors.Unauthorized("token expired");

  const audIsValid = aud === process.env.JWT_AUD;

  if (!audIsValid) throw new httpErrors.Unauthorized("token invalid");

  const issIsValid = iss === process.env.JWT_ISS;

  if (!issIsValid) throw new httpErrors.Unauthorized("token invalid");
};

const authenticationHandler = (
  req,
  securityDefinition,
  _bearer_token,
  callback
) => {
  const removeBearerRegex = /^Bearer/g;

  const token = (_bearer_token || "").replace(removeBearerRegex, "").trim();

  const hasToken = !!token;

  if (hasToken === false) {
    throw new httpErrors.Unauthorized("missing token");
  }

  tokenExpired({ token });

  const tokenPayload = jwt.decode(token, {});

  req.auth = tokenPayload;

  return callback();
};

module.exports = { authenticationHandler };
