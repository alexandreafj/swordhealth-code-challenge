const httpErrors = require("http-errors");
const jwt = require("jsonwebtoken");

const tokenExpired = ({ bearer_token }) => {
  const token_payload = jwt.decode(bearer_token, {});

  const { exp } = token_payload;

  const unix_format = 1000;

  const token_date = new Date(exp * unix_format).getTime();

  const today = new Date().getTime();

  const token_has_expired = token_date < today;

  if (token_has_expired) throw new httpErrors.Unauthorized("token expired");
};

const authenticationHandler = (
  req,
  securityDefinition,
  _bearer_token,
  callback
) => {
  const remove_bearer_regex = /^Bearer/g;

  const bearer_token = (_bearer_token || "")
    .replace(remove_bearer_regex, "")
    .trim();

  const has_token = !!bearer_token;

  if (has_token === false) {
    throw new httpErrors.Unauthorized("missing token");
  }

  tokenExpired({ bearer_token });

  const token_payload = jwt.decode(bearer_token, {});

  req.auth = token_payload;

  return callback();
};

module.exports = { authenticationHandler };
