const httpErrors = require("http-errors");
const removeBearerRegex = /^Bearer/g;
class AuthenticationHandler {
  constructor(jwt) {
    this.jwt = jwt;
  }

  authentication = (req, securityDefinition, _bearer_token, callback) => {
    const token = (_bearer_token || "").replace(removeBearerRegex, "").trim();

    const hasToken = !!token;

    if (hasToken === false) {
      throw new httpErrors.Unauthorized("missing token");
    }

    this.jwt.validateToken({ token });

    const tokenPayload = this.jwt.decode({ token });

    req.auth = tokenPayload;

    return callback();
  };
}

module.exports = { AuthenticationHandler };
