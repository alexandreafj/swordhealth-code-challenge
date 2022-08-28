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
}

module.exports = { Jwt };
