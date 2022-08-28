const jwt = require("jsonwebtoken");
const privateKey = process.env.JWT_PRIVATE_KEY;
const expiresIn = process.env.JWT_EXPIRES_IN || "1 day";
const issuer = process.env.JWT_ISS;
const audience = process.env.JWT_AUD;
const uuid = require("uuid");
const jwtid = uuid.v4();

class Jwt {
  constructor() {}
  generateJwt = ({ data }) => {
    const token = jwt.sign({ data }, privateKey, {
      expiresIn,
      issuer,
      audience,
      jwtid,
    });
    return { token };
  };
  tokenExpired = ({ token }) => {
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
  decode = ({ token }) => {
    return jwt.decode(token, {});
  };
}

module.exports = { Jwt };
