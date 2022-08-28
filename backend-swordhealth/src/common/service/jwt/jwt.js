const jwt = require("jsonwebtoken");
const uuid = require("uuid");
const httpErrors = require("http-errors");

class Jwt {
  constructor() {
    this.privateKey = process.env.JWT_PRIVATE_KEY;
    this.expiresIn = process.env.JWT_EXPIRES_IN || "1 day";
    this.issuer = process.env.JWT_ISS;
    this.audience = process.env.JWT_AUD;
  }
  generateJwt = ({ data }) => {
    const jwtid = uuid.v4();
    const token = jwt.sign({ data }, this.privateKey, {
      expiresIn: this.expiresIn,
      issuer: this.issuer,
      audience: this.audience,
      jwtid,
    });
    return { token };
  };
  validateToken = ({ token }) => {
    jwt.verify(token, this.privateKey);

    const tokenPayload = jwt.decode(token, {});

    const { exp = 0, aud, iss } = tokenPayload;

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
  decode = ({ token }) => {
    return jwt.decode(token, {});
  };
}

module.exports = { Jwt };
