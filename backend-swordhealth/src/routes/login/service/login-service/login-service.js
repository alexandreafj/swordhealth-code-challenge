const httpErrors = require("http-errors");

class LoginService {
  constructor({ userRepository, bcrypt, jwt, redis }) {
    this.userRepository = userRepository;
    this.bcrypt = bcrypt;
    this.jwt = jwt;
    this.redis = redis;
  }
  verifyCredentials = async ({ email, password }) => {
    const [user] = await this.userRepository.findOne({
      email,
    });
    const hasFoundUser = !!user;
    if (hasFoundUser === false) {
      throw new httpErrors.Unauthorized(
        "You have entered an invalid username or password"
      );
    }
    const { password: hash = "" } = user;
    const passwordMatch = await this.bcrypt.comparePassword({ hash, password });
    if (passwordMatch === false) {
      throw new httpErrors.Unauthorized(
        "You have entered an invalid username or password"
      );
    }
    return { user };
  };
  generateToken = ({ user }) => {
    const data = {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    };
    const { token } = this.jwt.generateJwt({ data });
    return { token };
  };
}
module.exports = { LoginService };
